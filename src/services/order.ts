import type { OrderCreateParams, OrderPreResult, OrderResult } from '@/types/order'
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

// 获取订单详情
export const getMemberOrderByIdAPI = (id: string) =>
  http<OrderResult>({
    method: 'GET',
    url: `/member/order/${id}`,
  })

// 填写订单-获取再次购买订单
export const getMemberOrderRepurchaseByIdAPI = (id: string) =>
  http<OrderPreResult>({
    url: `/member/order/repurchase/${id}`,
  })

// 模拟发货-内测版
export const getMemberOrderConsignmentByIdAPI = (id: string) =>
  http({
    method: 'GET',
    url: `/member/order/consignment/${id}`,
  })
