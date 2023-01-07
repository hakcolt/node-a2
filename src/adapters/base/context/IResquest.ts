import LocaleTypeEnum from "../../../application/shared/locals/LocaleType.enum"

export interface IRequest {
  isWhiteList: boolean;
  cookies: Record<string, any>
  body: any;
  params: Record<string, string>;
  query: Record<string, string>;
  locale: LocaleTypeEnum;
  ipAddress: string;
  userAgent: string;
  origin: string;
}