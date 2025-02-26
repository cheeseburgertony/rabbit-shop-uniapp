<script setup lang="ts">
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods'
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import AddressPanel from './components/AddressPanel.vue'
import ServicePanel from './components/ServicePanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'
import type {
  SkuPopupEvent,
  SkuPopupInstance,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import { postMemberCartAPI } from '@/services/cart'
import type { AddressPanelInstance } from '@/types/component'
import { useAddressStore } from '@/stores/modules/address'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 获取页面参数
const query = defineProps<{
  id: string
}>()
// 获取商品详情
const goods = ref<GoodsResult>()
const getGoodsByIdData = async () => {
  const res = await getGoodsByIdAPI(query.id)
  goods.value = res.result
  // 拿到后端返回的数据后映射为SKU组件所需格式
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map((item) => ({ name: item.name, list: item.values })),
    sku_list: res.result.skus.map((item) => ({
      _id: item.id,
      goods_id: res.result.id,
      goods_name: res.result.name,
      image: item.picture,
      price: item.price * 100,
      stock: item.inventory,
      sku_name_arr: item.specs.map((val) => val.valueName),
    })),
  }
}

const isFinish = ref(false)
onLoad(async () => {
  await getGoodsByIdData()
  isFinish.value = true
})

// 轮播图切换
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (e) => {
  currentIndex.value = e.detail.current
}

// 点击图片预览放大
const onTabImage = (url: string) => {
  uni.previewImage({
    current: url,
    urls: goods.value!.mainPictures,
  })
}

// 弹出层
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 弹出层条件渲染
const popupName = ref<'address' | 'service'>()
const onPopup = (name: typeof popupName.value) => {
  popupName.value = name
  popup.value?.open()
}

// 显示SKU组件
const isShowSku = ref(false)
// 商品数据
const localdata = ref({} as SkuPopupLocaldata)
// 弹窗模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
const mode = ref<SkuMode>(SkuMode.Both)
// 打开弹窗
const openSkuPopup = (val: SkuMode) => {
  isShowSku.value = true
  mode.value = val
}

// Sku组件实例
const skuPopupRef = ref<SkuPopupInstance>()
// 通过计算属性计算被选中的值
const selectArrText = computed(
  () => skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格',
)

// 加入购物车
const onAddCart = async (e: SkuPopupEvent) => {
  await postMemberCartAPI({ skuId: e._id, count: e.buy_num })
  uni.showToast({ icon: 'success', title: '添加成功' })
  isShowSku.value = false
}

// 立即购买
const onBuyNow = (e: SkuPopupEvent) => {
  // 跳转到订单页面并且携带参数
  uni.navigateTo({
    url: `/pagesOrder/create/create?skuId=${e._id}&count=${e.buy_num}`,
  })
  isShowSku.value = false
}

// 获取选择的地址
const addressStore = useAddressStore()
</script>

<template>
  <!-- SKU组件 -->
  <vk-data-goods-sku-popup
    v-model="isShowSku"
    :localdata="localdata"
    :mode="mode"
    add-cart-background-color="#ffa868"
    buy-now-background-color="#27ba9b"
    ref="skuPopupRef"
    :actived-style="{
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#E9F8F5',
    }"
    @add-cart="onAddCart"
    @buy-now="onBuyNow"
  />

  <scroll-view v-if="isFinish" scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper circular @change="onChange">
          <swiper-item v-for="item in goods?.mainPictures" :key="item">
            <image @tap="onTabImage(item)" mode="aspectFill" :src="item" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goods?.mainPictures.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goods?.price }}</text>
        </view>
        <view class="name ellipsis"> {{ goods?.name }} </view>
        <view class="desc"> {{ goods?.desc }} </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow" @tap="openSkuPopup(SkuMode.Both)">
          <text class="label">选择</text>
          <text class="text ellipsis"> {{ selectArrText }} </text>
        </view>
        <view class="item arrow" @tap="onPopup('address')">
          <text class="label">送至</text>
          <text class="text ellipsis" v-if="addressStore.selectedAddress">
            {{ addressStore.selectedAddress.fullLocation }}
            {{ addressStore.selectedAddress.address }}
          </text>
          <text class="text ellipsis" v-else> 请选择收获地址 </text>
        </view>
        <view class="item arrow" @tap="onPopup('service')">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goods?.details.properties" :key="item.name">
            <text class="label">{{ item.name }}</text>
            <text class="value">{{ item.value }}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          v-for="item in goods?.details.pictures"
          :key="item"
          mode="widthFix"
          :src="item"
        ></image>
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in goods?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goods/goods?id=${item.id}`"
        >
          <image class="image" mode="aspectFill" :src="item.picture"></image>
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>
  <PageSkeleton v-else></PageSkeleton>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <!-- #ifdef MP-WEIXIN -->
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <!-- #endif -->
      <navigator class="icons-button" url="/pages/cart/cart2" open-type="navigate">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="openSkuPopup(SkuMode.Cart)"> 加入购物车 </view>
      <view class="buynow" @tap="openSkuPopup(SkuMode.Buy)"> 立即购买 </view>
    </view>
  </view>

  <!-- 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel
      ref="addressRef"
      v-if="popupName === 'address'"
      @close="popup?.close"
    ></AddressPanel>
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close"></ServicePanel>
  </uni-popup>
</template>

<style lang="scss">
/* #ifdef H5 || APP-PLUS */
/* 解决navigator打包后外面多套一层a标签导致flex: 1失效 */
.toolbar .icons .navigator-wrap {
  flex: 1;
}
/* #endif */
@import './components/styles/goods.scss';
</style>
