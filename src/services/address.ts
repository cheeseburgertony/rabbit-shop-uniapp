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

// 获取收货地址详情
export const getMemberAddressByIdAPI = (id: string) =>
  http<AddressItem>({
    method: 'GET',
    url: `/member/address/${id}`,
  })

// 修改收货地址
export const putMemberAddressByIdAPI = (id: string, data: AddressParams) =>
  http({
    method: 'PUT',
    url: `/member/address/${id}`,
    data,
  })

// 删除收货地址
export const deleteMemberAddressByIdAPI = (id: string) =>
  http({
    method: 'DELETE',
    url: `/member/address/${id}`,
  })
