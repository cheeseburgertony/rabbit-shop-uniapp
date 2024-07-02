<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue'

// 获取banner数据
const bannerList = ref<BannerItem[]>([])
const getHomeBanner = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 获取前台分类数据
const getHomeCategory = async () => {
  const res = await getHomeCategoryAPI()
}

onLoad(() => {
  getHomeBanner()
  getHomeCategory()
})
</script>

<template>
  <!-- 自定义导航 -->
  <CustomNavbar></CustomNavbar>
  <!-- 轮播图 -->
  <XtxSwiper :list="bannerList"></XtxSwiper>
  <!-- 前台分类组件 -->
  <CategoryPanel></CategoryPanel>
  <view>index</view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
</style>
