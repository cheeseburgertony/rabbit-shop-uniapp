import type { AddressParams } from '@/types/address'
import { http } from '@/utils/http'

// 添加收货地址
// /member/address
export const postMemberAddress = (data: AddressParams) =>
  http({
    method: 'POST',
    url: '/member/address',
    data,
  })
