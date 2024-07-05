import type { OrderCreateParams, OrderPreResult } from '@/types/order'
import { http } from '@/utils/http'

// 填写订单-获取预付订单
export const getMemberOrderPreAPI = () =>
  http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre',
  })

// 填写订单-获取立即购买订单
export const getMemberOrderPreNowAPI = (data: {
  skuId: string
  count: string
  addressId?: string
}) =>
  http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre/now',
    data,
  })

// 提交订单
export const postMemberOrderAPI = (data: OrderCreateParams) =>
  http<{ id: string }>({
    method: 'POST',
    url: '/member/order',
    data,
  })
