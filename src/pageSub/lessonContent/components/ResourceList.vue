<!--
 * @Author: Lowkey
 * @Date: 2024-02-07 12:51:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-26 16:52:44
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\ResourceList.vue
 * @Description: 
-->
<template>
    <view v-for="item in list" :key="item.id" class="content">
        <view v-if="item.modname === 'label'" class="label-content">
            <render-html :html="item.description" />
            <StatusIcon v-if="String(item.tracking) !==ResourceTracking.NONE" :id="item.id" :state="String(item.stats.state)" :tracking="String(item.tracking)" />
        </view>
        <view v-else class="resource-container">
            <view class="content" @click="()=>handleResourceClick(item,courseid)">
                <image :class="['icon',item.availabilityinfo&&'disabled']" :src="getImages(item.modicon.replace(pattern('svg'), 'fordson'))" mode="widthFix" />
                <view :class="['right-content',item.availabilityinfo&&'disabled']">
                    <view class="name">{{ item.name }}</view>
                    <StatusIcon v-if="String(item.tracking) !==ResourceTracking.NONE" :id="item.id" :state="String(item.stats.state)" :tracking="String(item.tracking)" />
                </view>
            </view>
            <view v-if="item.description" class="description">
                <rich-text :nodes="item.description" space />
                <view class="mask-container">
                    <view class="mask"></view>
                    <view class="btn">查看描述</view>
                </view>
            </view>
            <view v-if="item.availabilityinfo" class="availabilityinfo">
                <rich-text :nodes="item.availabilityinfo" space />
            </view>
        </view>
    </view>
</template>

<script setup name="ResourceList">
import { getImages,pattern } from '@/utils';
import {ResourceTracking} from '@/enums/statusEnum';
import useLessonResource from '@/hooks/useLessonResource';
import StatusIcon from './StatusIcon.vue';
const { handleResourceClick } = useLessonResource();
defineProps({
    list: {
        type: Array,
        default: ()=>[]
    },
});
const courseid =ref('');
onLoad((option) => {
    if (option && option.courseid) {
        courseid.value = option.courseid;
    }
});
</script>

<style scoped lang="scss">
.label-content {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: $uni-font-size-lg !important;
  padding: 20rpx  0;
  p {
    margin: 0;
    font-size: $uni-font-size-lg !important;
    font-weight: bold;
  }
}
.resource-container {
  padding: 20rpx 0;
  border-bottom: 1px solid $uni-border-color;
  .content {
    display: flex;
    width: 100%;
    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }
    .right-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      color: $uni-color-title;
      font-size: $uni-font-size-m;
      flex: 1;
      .name {
        flex: 1;
      }
    }
  }
}
.description {
  position: relative;
  font-size: $uni-font-size-base;
  color: $uni-color-subtitle;
  margin-top: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: $uni-line-height;
  @include break;
  p {
    margin: 0;
  }
  * {
    font-size: $uni-font-size-base !important;
  }
  img {
    max-width: 100% !important;
    height: auto !important;
  }
  .mask-container {
    display: flex;
    position: absolute;
    width: 100%;
    bottom: -2rpx;
    box-sizing: border-box;
    text-align: right;
    color: $uni-color-primary;
    .mask {
      flex: 1;
      background-image: linear-gradient(180deg, hsl(0deg 0% 100% / 60%), #fff);
    }
    .btn {
      background-color: #fff;
    }
  }
}
.availabilityinfo {
  font-size: $uni-font-size-base !important;
  color: #c83737;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-height: $uni-line-height;
  @include break;
  p h1 h2 h3 h4 h5 h6 ul strong span {
    margin: 0;
    font-size: $uni-font-size-base !important;
  }
}
.disabled {
  opacity: 0.6;
}
</style>@/hooks/useLessonResource