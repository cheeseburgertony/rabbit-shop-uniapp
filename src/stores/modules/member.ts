import type { LoginResult } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<LoginResult>()

    // 城市代码
    const fullLocationCode = ref<[string, string, string]>(['', '', ''])

    // 修改城市代码
    const setFullLocationCode = (arr: [string, string, string]) => {
      fullLocationCode.value = arr
    }

    // 保存会员信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      fullLocationCode,
      setProfile,
      clearProfile,
      setFullLocationCode,
    }
  },
  // TODO: 持久化
  {
    // 网页端写法
    // persist: true,
    // 小程序端需要写成对象详细配置
    persist: {
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
        getItem(key) {
          return uni.getStorageSync(key)
        },
      },
    },
  },
)
