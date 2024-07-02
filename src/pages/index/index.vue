<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])

const getHomeBanner = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

onLoad(() => {
  getHomeBanner()
})
</script>

<template>
  <!-- 自定义导航 -->
  <CustomNavbar></CustomNavbar>
  <!-- 轮播图 -->
  <XtxSwiper :list="bannerList"></XtxSwiper>
  <view>index</view>
</template>

<style lang="scss">
//
</style>
