export type ISessionInput = { uid: string, email: string }

export interface ISession {
  token: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}