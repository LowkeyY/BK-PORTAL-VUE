<!--
 * @Author: Lowkey
 * @Date: 2024-01-15 15:57:14
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-03 17:40:48
 * @FilePath: \BK-Portal-VUE\src\components\StatusBar\StatusBar.vue
 * @Description: 
-->
<template>
    <view>
        <view class="status-bar" :style="{ height: statusBarHeight }" />
    </view>
</template>

<script setup name="StatusBar" lang="ts">
import { useSystem } from '@/hooks/app/useSystem';
import { px2rpx } from '@/utils/uniapi';
const statusBarHeight = `${px2rpx(useSystem().statusBarHeight || 0)}rpx`;
defineProps({
    text: {
        type: String,
        default: '-',
    },
});
</script>

<style lang="scss" scoped>
.status-bar {
  width: 100%;
  background-color: $uni-color-primary;
}
</style>
