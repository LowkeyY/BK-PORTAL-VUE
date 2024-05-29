<!--
 * @Author: Lowkey
 * @Date: 2024-05-24 13:17:54
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-29 12:27:26
 * @FilePath: \BK-Portal-VUE\src\components\SearchHeader\SearchHeader.vue
 * @Description: 
-->
<template>
    <view class="constainer">
        <image class="header-logo" src="/static/images/logos/header.png" mode="widthFix" />
        <view class="img-box">
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
const searchValue = ref('');
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
