import type { ProfileDetail, ProfileParams } from '@/types/member'
import { http } from '@/utils/http'

// 获取个人信息
export const getMemberProfileAPI = () =>
  http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })

// 修改个人信息
export const putMemberProfileAPI = (data: ProfileParams) =>
  http<ProfileDetail>({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
