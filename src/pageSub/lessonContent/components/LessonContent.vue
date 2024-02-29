<!--
 * @Author: Lowkey
 * @Date: 2024-01-24 18:48:45
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-29 16:55:51
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\LessonContent.vue
 * @Description: 
-->


<template>
    <pull-refresh-list type="content" show-skeleton :loading="useLesson.loading">
        <uni-collapse v-model="useLesson.collapseActiveIndex" accordion @change="change">
            <uni-collapse-item v-for="(item,index) in resources" :key="item.id" :show-animation="true" class="collapse-item" :title="lessonData.format === 'buttons'?index+1:item.name">
                <view class="content">
                    <view v-if="item.summary!==''" class="html">
                        <rich-text :nodes="item.summary" space />
                    </view>
                    <view v-if="item.availabilityinfo" class="html">
                        <rich-text :nodes="item.availabilityinfo" space />
                    </view>
                    <resource-list :list="item.modules" />
                </view>
            </uni-collapse-item>
        </uni-collapse>
    </pull-refresh-list>
</template>
<script lang="ts" setup name="LessonContent">

import {useLessonStore} from '@/store/modules/lesson';
import ResourceList from './ResourceList.vue';
const useLesson = useLessonStore();
const lessonData = computed(()=>useLesson.lessonData);
const resources = computed(()=>useLesson.getLessonResource);

const change = (val:string)=>{
    useLesson.collapseActiveIndex=val;
};
</script>
<style lang="scss" scoped>
::v-deep .uni-collapse-item__title-box {
  background-color: #2087ca;
  color: #fff;
  border-radius: 10px 10px 0 0;
}
.collapse-item {
  background-color: #2087ca;
  border-radius: 10px 10px 0 0;
  margin-bottom: 6rpx;
}
.content {
  .html {
    padding: 20rpx;
    p {
      font-size: $uni-font-size-lg;
      line-height: $uni-line-height;
    }
  }
}
</style>
