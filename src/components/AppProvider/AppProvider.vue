
<script lang="ts" setup name="AppProvider"></script>
<template>
    <view class="container">
        <slot></slot>
    </view>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #fff;
}
</style>
