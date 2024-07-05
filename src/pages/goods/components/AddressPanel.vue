<script setup lang="ts">
import { getMemberAddressAPI } from '@/services/address'
import { useAddressStore } from '@/stores/modules/address'
import type { AddressItem } from '@/types/address'
import { onMounted, ref } from 'vue'
// 子组件调用父组件的方法
// TS写法  (event: '要调用的方法的名称'): 返回值类型
const emit = defineEmits<{
  (event: 'close'): void
}>()

// 如果是地址则发送获取地址请求
const addressList = ref<AddressItem[]>([])
const getMemberAddressData = async () => {
  const res = await getMemberAddressAPI()
  addressList.value = res.result
  console.log(111)
}
onMounted(() => {
  getMemberAddressData()
})

// 选择地址
const onSelectAddress = (item: AddressItem) => {
  // 排他思想先去除掉默认的,然后给当前的加上默认
  addressList.value.forEach((item) => (item.isDefault = 0))
  item.isDefault = 1
}

// 新建地址
const onCreateAddress = () => {
  uni.navigateTo({ url: '/pagesMember/address-form/address-form' })
  emit('close')
}

// 点击确定
const addressStore = useAddressStore()
const selectedAddress = ref<AddressItem>()
const onConfirm = () => {
  selectedAddress.value = addressList.value.find((item) => item.isDefault)
  // 保存到仓库
  addressStore.changeSelectedAddress(selectedAddress.value!)
  emit('close')
}
</script>

<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item" v-for="item in addressList" :key="item.id" @tap="onSelectAddress(item)">
        <view class="user">{{ item.receiver }} {{ item.contact }}</view>
        <view class="address">{{ item.fullLocation }}{{ item.address }}</view>
        <text class="icon" :class="item.isDefault ? 'icon-checked' : 'icon-ring'"></text>
      </view>
    </view>
    <view class="footer">
      <view v-if="addressList.length" class="button primary" @tap="onConfirm">确定</view>
      <view v-else class="button primary" @tap="onCreateAddress"> 新建地址 </view>
    </view>
  </view>
</template>

<style lang="scss">
.address-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;

  .item {
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-size: 40rpx;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
    position: relative;
  }

  .icon {
    color: #999;
    font-size: 40rpx;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
  }

  .icon-checked {
    color: #27ba9b;
  }

  .icon-ring {
    color: #444;
  }

  .user {
    font-size: 28rpx;
    color: #444;
    font-weight: 500;
  }

  .address {
    font-size: 26rpx;
    color: #666;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .primary {
    color: #fff;
    background-color: #27ba9b;
  }

  .secondary {
    background-color: #ffa868;
  }
}
</style>
