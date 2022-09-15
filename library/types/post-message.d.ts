export interface PostMessageDataI {
  type: MessageType;
  token?: string;
  companyId?: string;
  companyName?: string;
  currentLocale?: string; // 语言
}