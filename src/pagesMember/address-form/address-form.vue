<script setup lang="ts">
import {
  getMemberAddressByIdAPI,
  postMemberAddressAPI,
  putMemberAddressByIdAPI,
} from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'
import type { UniFormsInstance } from '@uni-helper/uni-ui-types'
import { ref } from 'vue'

// 表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})

// 获取页面参数
const query = defineProps<{
  id?: string
}>()

// 修改页面-获取收货地址详情
const getMemberAddressByIdData = async () => {
  if (query.id) {
    // 发送请求
    const res = await getMemberAddressByIdAPI(query.id)
    // 合并数据到表单数据中
    Object.assign(form.value, res.result)
  }
}

onLoad(() => {
  getMemberAddressByIdData()
})

// 设置导航栏标题
uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })

// #ifdef MP-WEIXIN
// 修改地区
const onRegionChange: UniHelper.RegionPickerOnChange = (e) => {
  // 前端展示
  form.value.fullLocation = e.detail.value.join(' ')
  // 发生给后端的数据
  const [provinceCode, cityCode, countyCode] = e.detail.code!
  // 将获取到数据传入到表单收集
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}
// #endif

// #ifdef H5 || APP-PLUS
// H5和app端修改地址
const onCityChange: UniHelper.UniDataPickerOnChange = (e) => {
  // 发生给后端的数据
  const [provinceCode, cityCode, countyCode] = e.detail.value.map((item) => item.value)
  // 将获取到数据传入到表单收集
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}
// #endif

// 修改默认地址
const onSwitchChange: UniHelper.SwitchOnChange = (e) => {
  form.value.isDefault = e.detail.value ? 1 : 0
}

// 表单验证规则
const rules: UniHelper.UniFormsRules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请输入收货人信息' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '请输入正确的手机号码' },
    ],
  },
  countyCode: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请输入详细地址' }],
  },
}
const formRef = ref<UniFormsInstance>()

// 提交表单
const onSubmit = async () => {
  try {
    // 进行表单校验
    await formRef.value?.validate?.()
    // 根据是否有id判断是修改地址还是新增地址
    if (query.id) {
      // 修改地址
      await putMemberAddressByIdAPI(query.id, form.value)
    } else {
      // 新增地址
      // 调用接口向后端发送数据
      await postMemberAddressAPI(form.value)
    }
    // 进行提示并且返回上一页
    uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}
</script>

<template>
  <view class="content">
    <uni-forms ref="formRef" :rules="rules" :model="form">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receiver" />
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="form.contact" />
      </uni-forms-item>
      <uni-forms-item name="countyCode" class="form-item">
        <text class="label">所在地区</text>
        <!-- #ifdef MP-WEIXIN -->
        <picker @change="onRegionChange" class="picker" mode="region" :value="form.fullLocation">
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
        <!-- #endif -->
        <!-- #ifdef H5 || APP-PLUS -->
        <uni-data-picker
          placeholder="请选择地址"
          popup-title="请选择城市"
          collection="opendb-city-china"
          field="code as value, name as text"
          orderby="value asc"
          :step-searh="true"
          self-field="code"
          parent-field="parent_code"
          :clear-icon="false"
          @change="onCityChange"
          v-model="form.countyCode"
        >
        </uni-data-picker>
        <!-- #endif -->
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address" />
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          @change="onSwitchChange"
          class="switch"
          color="#27ba9b"
          :checked="form.isDefault ? true : false"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
</template>

<style lang="scss">
/* #ifdef H5 || APP-PLUS */
// 修改地址选择picker样式
:deep(.selected-area) {
  height: auto;
  flex: 0 1 auto;
}

/* #endif */
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
