import type { PageParams } from '@/types/global'
import { http } from './http'

// 获取热门推荐数据
// 获取热门推荐参数数据类型
type HotParams = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: HotParams) =>
  http({
    method: 'GET',
    url,
    data,
  })
