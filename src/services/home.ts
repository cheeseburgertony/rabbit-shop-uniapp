import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { http } from '@/utils/http'

// 首页-广告区域-小程序
export const getHomeBannerAPI = (distributionSite = 1) =>
  http<BannerItem[]>({
    url: '/home/banner',
    method: 'GET',
    data: {
      distributionSite,
    },
  })

// 首页-前台分类-小程序
export const getHomeCategoryAPI = () =>
  http<CategoryItem[]>({
    url: '/home/category/mutli',
    method: 'GET',
  })

// 首页-热门推荐-小程序
export const getHomeHotAPI = () =>
  http<HotItem[]>({
    url: '/home/hot/mutli',
    method: 'GET',
  })
