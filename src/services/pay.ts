import { http } from '@/utils/http'

// 获取微信支付参数
export const getPayWxPayMiniPayAPI = (orderId: string) =>
  http<WechatMiniprogram.RequestPaymentOption>({
    method: 'GET',
    url: '/pay/wxPay/miniPay',
    data: {
      orderId,
    },
  })

// 模拟支付-内测版
export const getPayMockAPI = (orderId: string) =>
  http({
    method: 'GET',
    url: '/pay/mock',
    data: {
      orderId,
    },
  })
