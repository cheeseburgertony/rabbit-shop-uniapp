import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'

// 添加收货地址
// /member/address
export const postMemberAddressAPI = (data: AddressParams) =>
  http({
    method: 'POST',
    url: '/member/address',
    data,
  })

// 获取收货地址列表
export const getMemberAddressAPI = () =>
  http<AddressItem[]>({
    method: 'GET',
    url: '/member/address',
  })
