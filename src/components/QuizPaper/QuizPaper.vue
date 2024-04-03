<!--
 * @Author: Lowkey
 * @Date: 2024-04-03 15:03:58
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-03 16:34:09
 * @FilePath: \BK-Portal-VUE\src\components\QuizPaper\QuizPaper.vue
 * @Description: 
-->
<template>
    <uni-forms ref="formRef" :model="formData" label-position="top">
        <uni-card v-for="(item,index) in questions" :key="index">
            <template #title>
                <view class="card-header">
                    <view class="header-title">{{ item.info.title }}</view>
                    <view class="header-info">
                        <view :style="{color:checkboxColor(item.info.state)}">{{ item.info.state }}</view>
                        <view>{{ item.info.grade }}</view>
                    </view>
                </view>
            </template>
            <view class="question">
                <uni-forms-item :name="item.name">
                    <template #label>
                        <view>
                            <rich-text :nodes="item.info.qtext" space />
                            <view class="prompt"> {{ item.info.prompt }}</view>
                        </view>
                    </template>
                    <view v-if="item.type === 'truefalse' || item.type === 'multichoice' || item.type === 'multichoiceset'">
                        <uni-data-checkbox v-model="formData[item.name]" :selected-color="checkboxColor(item)" :multiple="item.choose[0]?.type!=='radio'" :localdata="item.choose" />
                    </view>
                </uni-forms-item>
            </view>
        </uni-card>
    </uni-forms>
</template>

<script setup name="QuizPaper" lang="ts">
import { isString } from '@/utils/is';

const props = defineProps({
    questions: {
        type: Array<any>,
        default:()=>[]
    },
    formData: {
        type: Object,
        default: () => (reactive({}))
    },
});
const { formData } = toRefs(props);
const formRef = ref();
const checkboxColor = (item) =>{
    let state = '';
    if(isString(item)){
        state=item;
    }else{
        const checked = item.choose.find(item=>item.checked)||{};
        const {currect=''} = checked;
        state=currect;
    }
   
    if(state === '不正确' || state === '错误'){
        return '#e43d33';
    }else if(state === '正确'){
        return '#18bc37';
    }else{
        return '#007aff';
    }
};
defineExpose({
    formData,
    formRef
});
</script>

<style lang="scss" scoped>
::v-deep .checklist-group {
  flex-direction: column !important;
  .uni-label-pointer {
    margin: 20rpx 0 !important;
  }
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1px solid $uni-border-color;
  .header-title {
    font-size: $uni-font-size-lg;
  }
  .header-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: $uni-font-size-base;
    color: $uni-color-subtitle;
  }
}
.question {
  margin-bottom: 40rpx;
  font-size: $uni-font-size-lg;
  color: $uni-color-title;
  line-height: $uni-line-height;
  overflow: hidden;
  word-wrap: break-word;
  * {
    font-size: $uni-font-size-lg !important;
    color: $uni-color-title;
    line-height: $uni-line-height;
  }
  p {
    margin: 0;
  }
  img {
    max-width: 100% !important;
    height: auto;
  }
  pre {
    white-space: pre-wrap;
  }
  .prompt {
    font-size: $uni-font-size-base !important;
    margin-top: 12rpx;
    margin-bottom: 20rpx;
    color: $uni-color-subtitle;
  }
}
</style>