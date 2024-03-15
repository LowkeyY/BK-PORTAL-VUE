<!--
 * @Author: Lowkey
 * @Date: 2024-02-05 17:13:36
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-14 15:38:35
 * @FilePath: \BK-Portal-VUE\src\components\RenderHtml\RenderHtml.vue
 * @Description: 
-->


<template>
    <view class="content">
        <rich-text :nodes="parseHtml(html)" space></rich-text>
    </view>
</template>
<script lang="ts" setup name="RenderHtml">

import parseHtml from '@/utils/html-parser.js';
defineProps({
    html: {
        type: [String,Object],
        default: ''
    },
});

</script>
<style lang="scss" scoped>
.content {
  margin: 20rpx;
  overflow: hidden;
  font-size: $uni-font-size-lg;
  line-height: 1.8;
  word-break: break-all;
  word-wrap: break-word;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6, {
    margin: 0.1em 0 !important;
    font-size: $uni-font-size-lg;
  }
  p,
  span,
  a {
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
  ul,
  ol {
    padding: 0 0 0 1em;
    margin: 0.1em 0 !important;
  }
  li {
    padding: 0;
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
::v-deep .content-table-div {
  width: 100%;
  padding-bottom: 10rpx;
  .table-div-tr {
    padding: 10rpx 0;
    .table-div-tr-td {
      padding: 10rpx 0;
    }
  }
  .clear {
    clear: both;
    margin: 0 auto;
    width: 0;
  }
}
::v-deep .content-table-first-bar {
  width: 100%;
  height: auto;
  overflow: auto hidden;
  .second-bar {
    position: relative;
  }
}
</style>
