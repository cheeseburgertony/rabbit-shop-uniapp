import type { BannerItem } from '@/types/home'
import { http } from '@/utils/http'

// 获取轮播图数据
export const getHomeBannerAPI = (distributionSite = 1) =>
  http<BannerItem[]>({
    url: '/home/banner',
    method: 'GET',
    data: {
      distributionSite,
    },
  })
