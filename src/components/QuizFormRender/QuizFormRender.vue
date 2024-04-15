<!--
 * @Author: Lowkey
 * @Date: 2024-04-03 15:03:58
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-15 18:40:09
 * @FilePath: \BK-Portal-VUE\src\components\QuizFormRender\QuizFormRender.vue
 * @Description: 
-->
<template>
    <uni-forms ref="formRef" :model="formData" label-position="top">
        <uni-card v-for="(item,index) in questions" :key="index">
            <template #title>
                <view class="card-header">
                    <view class="header-title">{{ item.info.title }}</view>
                    <view class="header-info">
                        <view :style="{color:setColor(item.info.state)}">{{ item.info.state }}</view>
                        <view>{{ item.info.grade }}</view>
                    </view>
                </view>
            </template>
            <view class="question">
                <view v-if="item.type==='description'" class="label">
                    <rich-text :nodes="parseHtml(item.info.qtext)" space />
                    <view class="prompt"> {{ item.info.prompt }}</view>
                </view>
                <uni-forms-item v-if="simpleForm.includes(item.type)" :name="item.name">
                    <template #label>
                        <view class="label">
                            <rich-text :nodes="parseHtml(item.info.qtext)" space />
                            <view class="prompt"> {{ item.info.prompt }}</view>
                        </view>
                    </template>
                    <view v-if="item.type === 'multichoice' || item.type === 'truefalse' || item.type === 'multichoiceset'">
                        <lie-checkbox v-model="formData[item.name]" selected-color="show" selected-text-color="show" :multiple="item.options[0]?.type!=='radio'" :localdata="item.options" />
                    </view>
                    <view v-if="item.type === 'essay'">
                        <bad-eidtor v-if="item.config.type==='editor'" v-model="formData[item.name]" :readonly="item.config.readonly" />
                        <uni-easyinput v-else v-model="formData[item.name]" type="textarea" placeholder="请输入回答" :disabled="item.config.readonly"></uni-easyinput>
                    </view>
                    <view v-if="item.type === 'shortanswer'">
                        <uni-easyinput v-model="formData[item.name]" :styles="{borderColor:setColor(item.config.correct),color:setColor(item.config.correct)}" :disabled="item.config.readonly==='readonly'" placeholder="请输入回答"></uni-easyinput>
                    </view>
                </uni-forms-item>
                <view v-else-if="item.type === 'match'">
                    <view class="label">
                        <rich-text :nodes="parseHtml(item.info.qtext)" space />
                        <view class="prompt"> {{ item.info.prompt }}</view>
                    </view>
                    <uni-forms-item v-for="pickerItem in item.questions" :key="pickerItem.name" :name="pickerItem.name">
                        <template #label>
                            <view class="label">
                                <rich-text :nodes="parseHtml(pickerItem.question)" space />
                            </view>
                            <uni-data-picker 
                                v-model="formData[pickerItem.name]" :class="{'picker-error':pickerItem.correct==='错误'||pickerItem.correct==='不正确','picker-correct':pickerItem.correct==='正确'}" :readonly="pickerItem.disabled==='disabled'" placeholder="请选择" :localdata="pickerItem.options"
                            >
                            </uni-data-picker>
                        </template>
                    </uni-forms-item>
                </view>
                <view v-else-if="item.type === 'multianswer'">
                    <view class="label">
                        <rich-text :nodes="parseHtml(item.question)" space />
                        <view class="prompt"> {{ item.info.prompt }}</view>
                    </view>
                    <uni-forms-item v-for="(form,index) in item.forms" :key="form.name" :name="form.name">
                        <template #label>
                            <view class="label">
                                {{ `回答${index+1}` }}
                            </view>
                            <uni-easyinput v-if="form.type==='text'" v-model="formData[form.name]" :styles="{borderColor:setColor(form.correct),color:setColor(form.correct)}" :disabled="form.readonly==='readonly'" placeholder="请输入回答"></uni-easyinput>
                            <!-- <uni-data-picker 
                                v-model="formData[form.name]" placeholder="请选择" :localdata="pickerItem.options"
                            >
                            </uni-data-picker> -->
                        </template>
                    </uni-forms-item>
                </view>
                <view v-else-if="item.type === 'gapselect'">
                    <view class="label">
                        <rich-text :nodes="parseHtml(item.info.qtext)" space />
                        <view class="prompt"> {{ item.info.prompt }}</view>
                    </view>
                    <uni-forms-item v-for="(form,index) in item.forms" :key="form.name" :name="form.name">
                        <template #label>
                            <view class="label">
                                {{ `回答${index+1}` }}
                            </view>
                            <uni-data-picker 
                                v-model="formData[form.name]" :class="{'picker-error':form.correct==='错误'||form.correct==='不正确','picker-correct':form.correct==='正确'}" :readonly="form.disabled==='disabled'" placeholder="请选择" :localdata="form.options"
                            >
                            </uni-data-picker>
                        </template>
                    </uni-forms-item>
                </view>
            </view>
            <view v-if="item.info.validationerror" class="error-text">
                {{ item.info.validationerror }}
            </view>
        </uni-card>
    </uni-forms>
</template>

<script setup name="QuizFormRender" lang="ts">
import parseHtml from '@/utils/html-parser.js';
import LieCheckbox from './LieCheckbox.vue';
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
const simpleForm = ['truefalse','multichoice','essay','shortanswer','multichoiceset'];
const setColor = (state:string) =>{

    if(state === '不正确' || state === '错误'){
        return '#e43d33';
    }else if(state === '正确'){
        return '#18bc37';
    }else{
        return '';
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
::v-deep .is-disabled {
  color: inherit;
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
  .label {
    margin: 20rpx 0;
  }
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
  table {
    height: auto;
    overflow: auto hidden;
  }
}
.error-text {
  border-top: 3px solid $uni-color-warning;
  color: $uni-color-warning;
  padding-top: 10rpx;
}
.picker-error {
  ::v-deep .input-value-border {
    border-color: $uni-color-error;
  }
  ::v-deep .text-color {
    color: $uni-color-error;
  }
}
.picker-correct {
  ::v-deep .input-value-border {
    border-color: $uni-color-success;
  }
  ::v-deep .text-color {
    color: $uni-color-success;
  }
}
</style>