import { http } from '@/utils/http'

// 商品详情
export const getGoodsByIdAPI = (id: string) =>
  http({
    method: 'GET',
    url: '/goods',
    data: {
      id,
    },
  })
