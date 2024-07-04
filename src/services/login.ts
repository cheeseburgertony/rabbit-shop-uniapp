import { http } from '@/utils/http'

type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}

// 小程序登录
export const PostLoginWxMinAPI = (data: LoginParams) =>
  http({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })

// 小程序登录-内测版
export const PostLoginWxMinSimpleAPI = (phoneNumber: string) =>
  http({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
