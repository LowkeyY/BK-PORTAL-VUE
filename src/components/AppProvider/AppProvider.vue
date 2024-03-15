<!--
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-01 14:00:28
 * @FilePath: \BK-Portal-VUE\src\components\AppProvider\AppProvider.vue
 * @Description: 
-->

<script lang="ts" setup name="AppProvider"></script>
<template>
    <view class="container">
        <slot></slot>
    </view>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #fff;
}
</style>
