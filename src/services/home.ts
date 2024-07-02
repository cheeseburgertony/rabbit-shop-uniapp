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

// 获取前台分类数据
export const getHomeCategoryAPI = () =>
  http({
    url: '/home/category/mutli',
    method: 'GET',
  })
