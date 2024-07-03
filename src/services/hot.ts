import type { PageParams } from '@/types/global'
import { http } from '../utils/http'
import type { HotResult } from '@/types/hot'

// 获取热门推荐数据
// 获取热门推荐参数数据类型
type HotParams = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: HotParams) =>
  http<HotResult>({
    method: 'GET',
    url,
    data,
  })
