<script setup lang="ts">
import {
  deleteMemberOrderAPI,
  getMemberOrderAPI,
  putMemberOrderByIdReceiptAPI,
} from '@/services/order'
import type { OrderItem, OrderListParams } from '@/types/order'
import { onMounted, ref } from 'vue'
import { orderStateList, OrderState } from '@/services/constants'
import { getPayMockAPI, getPayWxPayMiniPayAPI } from '@/services/pay'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const props = defineProps<{
  orderState: number
}>()

const queryParams: Required<OrderListParams> = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
}

// 是否全部加载完成
const isFinish = ref(false)
const orderList = ref<OrderItem[]>([])
// 发送请求
const getMemberOrderData = async () => {
  // 如果全部加载完成则不继续发送请求
  if (isFinish.value) return uni.showToast({ icon: 'none', title: '没有数据了~' })
  const res = await getMemberOrderAPI(queryParams)
  // 获取数据后追加到原数组
  orderList.value.push(...res.result.items)
  // 进行页数判断
  if (queryParams.page < res.result.pages) {
    queryParams.page++
  } else {
    isFinish.value = true
  }
}

// 上拉触底
const onScrolltolower = () => {
  getMemberOrderData()
}

// 下拉刷新
const isTrigger = ref(false)
const onRefresherrefresh = async () => {
  // 触发
  isTrigger.value = true
  // 重置界面设置
  queryParams.page = 1
  orderList.value = []
  isFinish.value = false
  // 等待
  await getMemberOrderData()
  // 不触发 关闭
  isTrigger.value = false
}

onMounted(() => {
  getMemberOrderData()
})

// 点击支付
const onOrderPay = async (id: string) => {
  if (import.meta.env.DEV) {
    // 开发环境 使用模拟接口
    await getPayMockAPI(id)
  } else {
    // #ifdef MP-WEIXIN
    // 生产环境 使用正式微信支付接口
    const res = await getPayWxPayMiniPayAPI(id)
    await wx.requestPayment(res.result)
    // #endif
  }
  // 支付成功 轻提示 改变订单状态
  uni.showToast({ title: '支付成功' })
  const order = orderList.value.find((item) => item.id === id)
  order!.orderState = OrderState.DaiFaHuo
}

// 确认收货
const onOrderConfirm = (id: string) => {
  // 给用户一个弹框提示 二次确认
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    success: async (success) => {
      if (success.confirm) {
        await putMemberOrderByIdReceiptAPI(id)
        const order = orderList.value.find((item) => item.id === id)
        order!.orderState = OrderState.YiWanCheng
        uni.showToast({ title: '确认收货成功' })
      }
    },
  })
}

// 删除订单
const onOrderDelete = (id: string) => {
  // 二次确认
  uni.showModal({
    content: '是否删除订单',
    success: async (success) => {
      if (success.confirm) {
        // 发送请求删除
        await deleteMemberOrderAPI([id])
        uni.showToast({ title: '删除订单成功' })
        // 重置界面设置
        queryParams.page = 1
        orderList.value = []
        isFinish.value = false
        getMemberOrderData()
      }
    },
  })
}
</script>

<template>
  <scroll-view
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTrigger"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onScrolltolower"
  >
    <view class="card" v-for="item in orderList" :key="item.id">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ item.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[item.orderState].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          v-if="item.orderState >= OrderState.DaiPingJia"
          class="icon-delete"
          @tap="onOrderDelete(item.id)"
        ></text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator
        v-for="sku in item.skus"
        :key="sku.id"
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${item.id}`"
        hover-class="none"
      >
        <view class="cover">
          <image mode="aspectFit" :src="sku.image"> </image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ sku.name }}</view>
          <view class="type">{{ sku.attrsText }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ item.totalNum }}件商品</text>
        <text>实付</text>
        <text class="amount"> <text class="symbol">¥</text>{{ item.payMoney }}</text>
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="item.orderState === OrderState.DaiFuKuan">
          <view class="button primary" @tap="onOrderPay(item.id)">去支付</view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${item.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="item.orderState === OrderState.DaiShouHuo"
            @tap="onOrderConfirm(item.id)"
            class="button primary"
            >确认收货</view
          >
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
