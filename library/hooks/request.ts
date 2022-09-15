import { ref, UnwrapRef, Ref, onMounted, reactive } from 'vue';
import { AxiosResponse } from 'axios';
import { Message, MessageReturn } from '@arco-design/web-vue'
import { BaseTableData, BaseTableResponse, initTableData } from '../types/global';

/**
 * 表格请求的钩子
 */
// 请求方法类型
type RequestTableService<R = any, P extends any[] = any> = (...args: P) => Promise<BaseTableResponse<R>>;
// 请求方法类型
type RequestService<R = any, P extends any[] = any> = (...args: P) => Promise<AxiosResponse<R>>;

export function useTableRequest<T = any> (
  requestFun: RequestTableService<T>, 
  params?: any, 
  immediate = true,
) {

  const data: Ref<BaseTableData<T>> = ref(initTableData)
  const loading = ref(false)


  const pagination = reactive({
    'total': 0,
    'current': 1,
    'page-size': 15,
    'show-total': true,
    'show-page-size': true,
  })

  const getList = async () => {
    params.page = pagination.current
    params.size = pagination['page-size']
    loading.value = true
    try {
      const res: BaseTableResponse<T> = await requestFun(params)
      data.value = {
        page: res.data.page ? Number(res.data.page) : 0,
        size: res.data.size ? Number(res.data.size) : 0,
        total: res.data.total ? Number(res.data.total) : 0,
        list: res.data.list
      }
      pagination.current = data.value.page
      pagination.total = data.value.total
      loading.value = false
    } catch(e:any) {
      data.value = initTableData
      loading.value = false
    }
  }

  const onCurrentChange = (pageIndex: number) => {
    pagination.current = pageIndex
    getList()
  }

  const onSizeChange = (_pageSize:number) => {
    pagination['page-size'] = _pageSize
    getList()
  }

  onMounted(() => {
    immediate && getList()
  })

  return {
    data,
    loading,
    getList,
    onCurrentChange,
    onSizeChange,
    pagination
  }
}

/**
 * useTableRequestV2 包括：查询、重置、删除、翻页功能
 * @param requestFun 请求表格数据的方法
 * @param params 请求表格数据的查询参数，不用带page相关参数
 * @param immediate 是否在onMounted的时候自动发起请求
 * @param resetParams 点击重置按钮的时候，重置的查询参数
 * @param deleteRequest 删除列表的某一条数据
 * @returns 
 */

export function useTableRequestV2<T = any> (
  requestFun: RequestTableService<T>, 
  params?: any, 
  immediate = true,
  resetParams?:any,
  deleteRequest?: RequestService<string>, 
) {

  const data: Ref<BaseTableData<T>> = ref(initTableData)
  const loading = ref(false)

  const pagination = reactive({
    'total': 0,
    'current': 1,
    'page-size': 10,
    'show-total': true,
    'show-page-size': true,
  })

  const getList = async () => {
    params.page = pagination.current
    params.size = pagination['page-size']
    loading.value = true
    try {
      const res: BaseTableResponse<T> = await requestFun(params)
      data.value = {
        page: res.data.page ? Number(res.data.page) : 0,
        size: res.data.size ? Number(res.data.size) : 0,
        total: res.data.total ? Number(res.data.total) : 0,
        list: res.data.list
      }
      pagination.current = data.value.page
      pagination.total = data.value.total
      loading.value = false
    } catch(e:any) {
      data.value = initTableData
      loading.value = false
    }
  }

  const onCurrentChange = (pageIndex: number) => {
    pagination.current = pageIndex
    getList()
  }

  const onSizeChange = (_pageSize:number) => {
    pagination['page-size'] = _pageSize
    getList()
  }

  // 点击查询按钮
  const onSearch = () => {
    pagination['current'] = 1
    getList()
  }
  
  // 点击重置按钮
  const onReset = () => {
    pagination['current'] = 1
    for (const key in resetParams) {
      params[key] = resetParams ? resetParams[key] : undefined
    }
    getList()
  }

  // 删除
  const onDelete = async (id: string | number) => {
    if (deleteRequest) {
      const l = Message.loading({content: '正在删除'})
      try {
        await deleteRequest(id)
        getList()
        l.close()
        Message.success({content: '删除成功'})
      } catch(e) {
        l.close()
        Message.error({content: '删除失败'})
      }
    }
  }

  onMounted(() => {
    immediate && getList()
  })

  return {
    data,
    loading,
    getList,
    onCurrentChange,
    onSizeChange,
    onSearch,
    onReset,
    onDelete,
    pagination
  }
}


// http请求的钩子， 用于onMounted里需要的请求
export function useRequestV2<T = any, P = any> (requestFun: RequestService<T>, initData: any, params?: any, immediate = true) {
  const data: Ref<T> = ref(initData)
  const loading = ref(false)

  const run = async (paramsI?: P) => {
    // 如果run函数在手动调用的时候传了参数，优先使用paramsI的参数
    const p = paramsI || params;
    loading.value = true
    try {
      const res: AxiosResponse<T> = await requestFun(p)
      data.value = (res as AxiosResponse<T>).data
      loading.value = false
      return Promise.resolve(res)
    } catch(e: any) {
      data.value = initData
      loading.value = false
      return Promise.reject(e)
    }
  }

  onMounted(() => {
    immediate && run()
  })

  return {
    data,
    loading,
    run,
  }
}

/*
*表单提交的钩子 封装提交按钮的防抖、提交的loading提示、提交成功/提交失败的提示
*@param submitFun 提交的方法名
*@param params 提交的参数
*@param message 提交过程中的提示 提交成功 提交失败的提示 传false不显示提示
*/

interface MessageI {
  success?: string | false,
  error	?: string | false,
  loading?: string | false
}

//T：接口返回数据的类型， P：提交的参数的类型
export function useFormSubmit<T, P> (submitFun: any, message: MessageI | boolean = true) {
  const loading = ref(false)

  const submit = async (params: P) => {
    loading.value = true
    const l = showMessage(MessageEnum.loading, message, defaultMessage);
    try {
      const res: AxiosResponse<T> = await submitFun(params)
      showMessage(MessageEnum.success, message, defaultMessage)
      loading.value = false;
      (l as MessageReturn).close()
      return Promise.resolve(res)
    } catch(e: any) {
      showMessage(MessageEnum.error, {error: e.message || message}, defaultMessage)
      loading.value = false;
      (l as MessageReturn).close()
      return Promise.reject(e.message)
    }
  }
 
  return {
    loading,
    submit
  }
}

/*
*一般操作的钩子: 比如开启，关闭。 封装提交按钮的防抖、提交的loading提示、操作成功/操作失败的提示
*@param submitFun 操作的方法名
*@param params 操作的参数
*@param message 操作过程中的提示 操作成功 操作失败的提示 传false不显示提示
*/
//T：接口返回数据的类型， P：提交的参数的类型
export function useOptionRequest<T, P> (submitFun: any, message: MessageI | boolean = true) {
  const loading = ref(false)

  const submit = async (params: P) => {
    loading.value = true
    const l = showMessage(MessageEnum.loading, message, defaultOptionMessage);
    try {
      const res: AxiosResponse<T> = await submitFun(params)
      showMessage(MessageEnum.success, message, defaultOptionMessage)
      loading.value = false;
      (l as MessageReturn).close()
      return Promise.resolve(res)
    } catch(e: any) {
      showMessage(MessageEnum.error, {error: e.message || message}, defaultOptionMessage)
      loading.value = false;
      (l as MessageReturn).close()
      return Promise.reject(e.message)
    }
  }
 
  return {
    loading,
    submit
  }
}

const defaultMessage = {
  success: '提交成功!',
  error: '提交失败!',
  loading: '正在提交'
}

const defaultOptionMessage = {
  success: '操作成功!',
  error: '操作失败!',
  loading: '正在提交'
}

enum MessageEnum {
  success = 'success',
  error = 'error',
  loading = 'loading'
}


function showMessage (type: MessageEnum, message:MessageI | boolean = true, defaultMsg: typeof defaultOptionMessage) {
  let content: string | boolean = ''
  if (message === false) return;
  if (typeof message === 'object') {
    const m = message[type];
    content =  m === undefined ? defaultMsg[type] : m;
  } else if (message === true) {
    content = defaultMsg[type];
  }

  if (content === false) return;

  switch(type) {
    case MessageEnum.loading: 
      return Message.loading({
        content,
      })
    case MessageEnum.success:
      Message.success({content})
      break;
    case MessageEnum.error:
      Message.error({content})
      break;
    default: 
      Message.info({content})
  }
}


