import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'

// 加入购物车
export const postMemberCartAPI = (data: { skuId: string; count: number }) =>
  http({
    method: 'POST',
    url: '/member/cart',
    data,
  })

// 获取购物车列表
export const getMemberCartAPI = () =>
  http<CartItem[]>({
    method: 'GET',
    url: '/member/cart',
  })

// 删除/清空购物车单品
export const deleteMemberCartAPI = (data: { ids: string[] }) =>
  http({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })

// 修改购物车单品
export const putMemberCartByIdAPI = (skuId: string, data: { selected?: boolean; count?: number }) =>
  http({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data,
  })

// 购物车全选/取消全选
export const putMemberCartSelectedAPI = (selected: boolean) =>
  http({
    method: 'PUT',
    url: '/member/cart/selected',
    data: {
      selected,
    },
  })
