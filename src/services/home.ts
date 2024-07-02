import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { http } from '@/utils/http'

// 首页-广告区域-小程序
export const getHomeBannerAPI = (distributionSite = 1) =>
  http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })

// 首页-前台分类-小程序
export const getHomeCategoryAPI = () =>
  http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })

// 首页-热门推荐-小程序
export const getHomeHotAPI = () =>
  http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })

// 猜你喜欢-小程序
export const getHomeGoodsGuessLikeAPI = () =>
  http({
    method: 'GET',
    url: '/home/goods/guessLike',
  })
