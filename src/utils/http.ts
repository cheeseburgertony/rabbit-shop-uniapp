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
    options.timeout = 10000
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
  },
}
// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

// 声明一个接口(类型)
interface Data<T> {
  code: string
  msg: string
  result: T
}

// 请求函数封装
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回一个Promise方便进行数据获取
  // 添加类型
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        // 这里使用类型断言来进行类型的更加确定
        // 根据返回的状态码进行进一步判断
        // 状态码为 2xx, 成功返回
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // token失效或者有问题 清除本地数据并且跳转到登录页 并且reject出去
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 进行一个轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        // 进行提示
        uni.showToast({
          icon: 'none',
          title: '网络错误,请换个网络试试',
        })
        reject(err)
      },
    })
  })
}
