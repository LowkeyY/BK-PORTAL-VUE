<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-29 15:05:28
 * @FilePath: \BK-Portal-VUE\src\components\Link\Link.vue
 * @Description: 
-->
<template>
    <view class="text">
        {{ text }}
    </view>
</template>

<script setup name="Link" lang="ts">
defineProps({

    text: {
        type: String,
        default: '-'
    }
});
</script>

<style lang="scss" scoped>
.text {
  color: $uni-text-color-link;
}
</style>