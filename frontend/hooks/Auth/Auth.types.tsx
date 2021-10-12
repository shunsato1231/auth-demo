export type Token = string;

export type User = {
  email: string;
  mfaEnabled: boolean;
  token: string;
};
