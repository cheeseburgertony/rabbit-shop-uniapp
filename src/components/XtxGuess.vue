<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import type { PageParams } from '@/types/global'
import type { GuessItem } from '@/types/home'
import { onMounted, ref } from 'vue'

const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}

const finish = ref(false)

// 获取猜你喜欢数据
const guessList = ref<GuessItem[]>([])
const getHomeGoodsGuessLikeData = async () => {
  if (finish.value) return uni.showToast({ icon: 'none', title: '没有数据了~' })
  const res = await getHomeGoodsGuessLikeAPI(pageParams)
  // 获取到数据后追加到原数组
  guessList.value.push(...res.result.items)
  // 判断页数是否大于最大页数
  if (pageParams.page < res.result.pages) {
    // 页数++以便获取下一页的数据
    pageParams.page++
  } else {
    finish.value = true
  }
}
// 在组件被挂载后发送请求获取数据，这样组件在复用的时候只要被挂载就能获取数据
onMounted(() => {
  getHomeGoodsGuessLikeData()
})

// 重置数据
const resetData = () => {
  pageParams.page = 1
  guessList.value = []
  finish.value = false
}
// 将组件内方法暴露出去给父组件使用
defineExpose({
  resetData,
  getMore: getHomeGoodsGuessLikeData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name"> {{ item.name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text"> {{ finish ? '没有数据了~' : '正在加载...' }} </view>
</template>

<style lang="scss">
@import '@/components/styles/XtxGuess.scss';
</style>
