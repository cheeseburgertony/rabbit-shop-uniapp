import { http } from '@/utils/http'

type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}

// 小程序登录
export const PostLoginWxMin = (data: LoginParams) =>
  http({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
