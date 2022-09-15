import { AxiosResponse } from "axios";

export interface Pagination {
  page: number;
  size: number;
  total?: number;
}

export type BaseResponse<T> = AxiosResponse<T>

export type BaseTableResponse<T> = AxiosResponse<BaseTableData<T>>

export interface BaseTableData<T> {
  page: number;
  size: number;
  total: number;
  list: T
}

export const initTableData: BaseTableData<any> = {
  page: 1,
  size: 0,
  total: 0,
  list: []
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export interface TeamDataI {
  teamList: TeamItemI[]
}

export interface TeamItemI {
  id: string;
  teamName: string;
  productList: ProductItemI[]
}


export interface ProductItemI {
  hasPermission: number;
  icon: string;
  id: string;
  name: string;
  productCode: string;
  teamId: string;
}

export interface MenuDataI {
  menuTree: MenuDataItemI[]
}

export interface MenuDataItemI {
  appName: string;
  children: MenuDataItemI[];
  icon: string;
  id: string;
  identify: string;
  isMenu: number; // 1 是菜单， 0  不是菜单
  name: string;
  pid: string;
  sort: number;
  status: 0 | 1;
  type: number;
  uri: string;
  urlQuery: string;
}

export interface GetUploadUrlParamsI {
  project: 'saas',
  prefix: 'avatar' | 'admin' | 'member' | 'product',
  extend: 'jpg' | 'jpeg' | 'png' | 'mp4'
}

export enum DefaultEnum {
  '默认' = '1',
  '非默认' = '0'
}

export enum EnableEnum {
  '启用' = '1',
  '停用' = '0'
}

export const StatusOption = [
  {value: -1, label: '全部'},
  {value: 1, label: '启用'},
  {value: 0, label: '停用'}
]
