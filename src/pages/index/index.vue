<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import type { XtxGuessInstance } from '@/types/component'

// 获取banner数据
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 获取前台分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

// 获取热门推荐数据
const hotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

// 滚动到底部
const guessRef = ref<XtxGuessInstance>()
const onScrolltolower = () => {
  console.log('滚动到底部')
  console.log(guessRef.value)
  guessRef.value?.getMore()
}

onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
  getHomeHotData()
})
</script>

<template>
  <!-- 自定义导航 -->
  <CustomNavbar></CustomNavbar>
  <!-- 滚动容器 -->
  <scroll-view @scrolltolower="onScrolltolower" class="scroll-view" scroll-y>
    <!-- 轮播图 -->
    <XtxSwiper :list="bannerList"></XtxSwiper>
    <!-- 前台分类 -->
    <CategoryPanel :list="categoryList"></CategoryPanel>
    <!-- 热门推荐 -->
    <HotPanel :list="hotList"></HotPanel>
    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef"></XtxGuess>
  </scroll-view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f7f7f7;
}

.scroll-view {
  flex: 1;
}
</style>
