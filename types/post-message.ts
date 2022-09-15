export enum MessageType {
  'init' = 'init',
  'local' = 'local'
}
export interface PostMessageDataI {
  type: MessageType;
  token?: string;
  companyId?: string;
  companyName?: string;
  currentLocale?: string; // 语言
}