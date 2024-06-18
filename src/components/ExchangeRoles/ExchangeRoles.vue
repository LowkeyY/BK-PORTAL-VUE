<!--
 * @Author: Lowkey
 * @Date: 2024-05-21 15:30:14
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 22:14:04
 * @FilePath: \BK-Portal-VUE\src\components\ExchangeRoles\ExchangeRoles.vue
 * @Description: 
-->
<template>
    <view class="container">
        <view>{{ `当前角色：` }}</view>
        <picker :value="index" :range="roles" @change="bindPickerChange">
            <view class="exchange">
                <image class="icon" src="@/static/images/spirit/exchange.svg" />
                切换
            </view>
        </picker>
    </view>
</template>

<script setup name="ExchangeRoles">
defineProps({});
const index = ref(0);
const roles = ['责任教师', '导学教师', '辅导教师', '学生'];
const bindPickerChange = (e) => {
    console.log(e);
};
</script>

<style scoped lang="scss">
.container {
  padding: 30rpx 20rpx 20rpx;
  display: flex;
  justify-content: space-between;
  font-size: $uni-font-size-lg;
  .exchange {
    display: flex;
    align-items: center;
    font-size: $uni-font-size-lg;
    color: $uni-color-primary;
  }
  .icon {
    width: 1em;
    height: 1em;
    margin-right: 10rpx;
  }
}
</style>
