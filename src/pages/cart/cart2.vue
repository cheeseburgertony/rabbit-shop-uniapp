<script setup lang="ts">
import CartMain from './components/CartMain.vue'

// 获取屏幕边界到安全区距离
// 通过父传子传给组件
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <CartMain :safeDistance="safeAreaInsets?.bottom"></CartMain>
</template>
