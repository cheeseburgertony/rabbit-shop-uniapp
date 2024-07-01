import { useMemberStore } from '@/stores'

// 请求基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 设置基地址
    // 不是http开头的则进行拼接
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 设置请求时间
    options.timeout = 1000
    // 设置请求标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 设置token
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    console.log(options)
  },
}
// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)
