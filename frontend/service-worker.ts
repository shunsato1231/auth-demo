import { precacheAndRoute } from 'workbox-precaching';
declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

let savedAccessToken: null | string = null;
let savedRefreshToken: null | string = null;

const requireAccessTokenUrls = [
  '/api/auth/verify_mfa',
  '/api/auth/mfa_qr_code',
  '/api/auth/mfa_setting_code',
  '/api/auth/enable_mfa',
];
const returnTokenUrls = [
  '/api/auth/signIn',
  '/api/auth/verify_mfa',
  '/api/auth/enable_mfa',
];
const apiOriginUrl = self.location.origin + '/api';
const isApiOriginUrl = (url: URL) => url.href.includes(apiOriginUrl);

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

// Clear token on postMessage
self.addEventListener('message', () => {
  savedAccessToken = '';
  savedRefreshToken = '';
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const destUrl = new URL(event.request.url);
  if (isApiOriginUrl(destUrl)) {
    const headers = new Headers(event.request.headers);
    if (requireAccessTokenUrls.includes(destUrl.pathname) && savedAccessToken) {
      headers.append('Authorization', `Bearer ${savedAccessToken}`);
    }

    const request = new Request(event.request, { headers });
    event.respondWith(hackResponse(request, destUrl));
  }
});

const hackResponse = async (request: Request, url: URL): Promise<Response> => {
  const response = await fetch(request);
  let body;

  if (returnTokenUrls.includes(url.pathname)) {
    const { accessToken, refreshToken, ...data } = await response.json();

    savedAccessToken = accessToken ? accessToken : savedAccessToken;
    savedRefreshToken = refreshToken ? refreshToken : savedRefreshToken;
    body = data;
  } else {
    body = await response.json().then((res) => res);
  }

  if (!response.ok && body?.code === 'invalid_token') {
    const refreshResponse = await fetch('/api/auth/refresh_token', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${savedRefreshToken}`,
      },
    });

    if (!refreshResponse.ok) {
      return new Response(null, {
        headers: refreshResponse.headers,
        status: refreshResponse.status,
        statusText: refreshResponse.statusText,
      });
    }

    const { accessToken, refreshToken } = await refreshResponse.json();

    savedAccessToken = accessToken ? accessToken : savedAccessToken;
    savedRefreshToken = refreshToken ? refreshToken : savedRefreshToken;

    const retryHeaders = new Headers(request.headers);
    retryHeaders.append('Authorization', `Bearer ${savedAccessToken}`);

    const retryBody = JSON.stringify(request.body) || null;
    const retryResponse = await fetch(url.href, {
      body: retryBody,
      method: request.method,
      headers: { Authorization: `Bearer ${savedAccessToken}` },
    });

    if (retryResponse.ok && returnTokenUrls.includes(url.pathname)) {
      const { accessToken, refreshToken, ...body } = await retryResponse.json();

      savedAccessToken = accessToken ? accessToken : savedAccessToken;
      savedRefreshToken = refreshToken ? refreshToken : savedRefreshToken;

      return new Response(JSON.stringify(body), {
        headers: retryResponse.headers,
        status: retryResponse.status,
        statusText: retryResponse.statusText,
      });
    }

    return new Response(JSON.stringify(await retryResponse.json()), {
      headers: retryResponse.headers,
      status: retryResponse.status,
      statusText: retryResponse.statusText,
    });
  }

  return new Response(JSON.stringify(body), {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
};
