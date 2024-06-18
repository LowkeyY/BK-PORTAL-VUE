<!--
 * @Author: Lowkey
 * @Date: 2024-05-24 13:17:54
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-13 10:21:37
 * @FilePath: \BK-Portal-VUE\src\components\SearchHeader\SearchHeader.vue
 * @Description: 
-->

<template>
    <view class="constainer" :style="{ height: `${160 + statusBarHeight}rpx` }">
        <image class="header-logo" src="/static/images/logos/header.png" mode="heightFix" />
        <view class="img-box" :style="{top:`${20+statusBarHeight}rpx`}">
            <image class="logo" src="/static/images/logos/singleLogo.png" mode="heightFix" />
            <view class="search-bar">
                <uni-search-bar
                    v-model="searchValue"
                    radius="100"
                    clear-button="none"
                    cancel-button="none"
                    :readonly="true"
                    placeholder="搜索模块"
                    @confirm="search"
                    @cancel="cancel"
                >
                </uni-search-bar>
            </view>
        </view>
        <view class="bottom" />
    </view>
</template>
<script lang="ts" setup>
import { useSystem } from '@/hooks/app/useSystem';
import { px2rpx } from '@/utils/uniapi';
const statusBarHeight = px2rpx(useSystem().statusBarHeight || 0);
const searchValue = ref('');
const search = ()=>{

};
const cancel = ()=>{
    
};
</script>
<style scoped lang="scss">
::v-deep .uni-searchbar__box {
  height: 50rpx;
}
.constainer {
  position: relative;
  box-sizing: border-box;
  .header-logo {
    width: 100%;
    height: 100%;
  }
  .img-box {
    width: 100%;
    padding: 0 100rpx 0 20rpx;
    position: absolute;
    top: 30rpx;
    display: flex;
    align-items: center;
    .logo {
      height: 50rpx;
      margin-right: 10rpx;
    }
    .search-bar {
      flex: 1;
    }
  }
  .bottom {
    position: absolute;
    bottom: 0;
    width: 100vw;
    height: 30rpx;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
  }
}
</style>
