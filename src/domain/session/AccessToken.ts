export type ISessionInput = { uid: string, email: string }

export interface AccessToken {
  token: string;
  createdAt: string;
  expiresAt: string;
}