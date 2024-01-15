<!--
 * @Author: Lowkey
 * @Date: 2024-01-15 15:57:14
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-15 16:02:16
 * @FilePath: \BK-Portal-VUE\src\components\StatusBar\StatusBar.vue
 * @Description: 
-->
<template>
    <view>
        <!--#ifdef APP_PLUSE-->
        <view class="status-bar" />
    </view>
    <!--#edif-->
</template>

<script setup name="StatusBar" lang="ts">
defineProps({
    text: {
        type: String,
        default: '-'
    }
});
</script>

<style lang="scss" scoped>
.status-bar {
  background-color: $uni-color-primary;
  height: var(--status-bar-height);
}
</style>