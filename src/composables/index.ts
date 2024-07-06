import type { XtxGuessInstance } from '@/types/component'
import { ref } from 'vue'

// 封装猜你喜欢分页加载
export const useGuessList = () => {
  const guessRef = ref<XtxGuessInstance>()
  // 触底触发
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }
  return {
    guessRef,
    onScrolltolower,
  }
}
