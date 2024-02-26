<!--
 * @Author: Lowkey
 * @Date: 2024-02-05 17:13:36
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-22 14:22:23
 * @FilePath: \BK-Portal-VUE\src\components\RenderHtml\RenderHtml.vue
 * @Description: 
-->


<template>
    <view class="container">
        <rich-text :nodes="html" space></rich-text>
    </view>
</template>
<script lang="ts" setup name="RenderHtml">
defineProps({
    html: {
        type: [String,Object],
        default: ''
    },
});
</script>
<style lang="scss" scoped>
.container {
  margin: 20rpx;
  overflow: hidden;
  font-size: $uni-font-size-lg;
  line-height: 1.8;
  word-break: break-all;
  word-wrap: break-word;
  h1 h2 h3 h4 h5 h6 ul ol {
    margin: 0.1em 0 !important;
    padding: 0;
    font-size: $uni-font-size-lg;
  }
  p span a {
    font-size: $uni-font-size-base;
  }
  strong {
    font-size: $uni-font-size-base;
  }
  div {
    max-width: 100% !important;
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  ul li ol {
    list-style: none;
  }
  img {
    max-width: 100% !important;
    max-height: 100% !important;
    height: auto !important;
  }
  .clear {
    clear: both;
    margin: 0 auto;
    width: 0;
  }
}
</style>
