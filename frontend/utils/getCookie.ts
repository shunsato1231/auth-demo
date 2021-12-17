export const getCookie = (key: string): string | undefined => {
  const map: { [key: string]: string } = {};
  if (document.cookie !== '') {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
      const data = cookie.split('=');
      map[data[0]] = decodeURIComponent(data[1]);
    }
  }

  return map?.[key];
};
