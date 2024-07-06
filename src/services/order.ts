import type { PageParams } from '@/types/global'
import type {
  OrderCreateParams,
  OrderListResult,
  OrderLogisticResult,
  OrderPreResult,
  OrderResult,
} from '@/types/order'
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

// 确认收货
export const putMemberOrderByIdReceiptAPI = (id: string) =>
  http<OrderResult>({
    method: 'PUT',
    url: `/member/order/${id}/receipt`,
  })

// 获取订单物流
export const getMemberOrderByIdLogisticsAPI = (id: string) =>
  http<OrderLogisticResult>({
    method: 'GET',
    url: `/member/order/${id}/logistics`,
  })

// 取消订单
export const putMemberOrderByIdCancelAPI = (id: string, cancelReason: string) =>
  http<OrderResult>({
    method: 'PUT',
    url: `/member/order/${id}/cancel`,
    data: {
      cancelReason,
    },
  })

// 删除订单
export const deleteMemberOrderAPI = (ids: string[]) =>
  http({
    method: 'DELETE',
    url: '/member/order',
    data: {
      ids,
    },
  })

// 获取订单列表
export const getMemberOrderAPI = (data: PageParams) =>
  http<OrderListResult>({
    method: 'GET',
    url: '/member/order',
    data,
  })
