<template>
    <view>
        <view class="top-info">
            <view v-if="curLessonData.attendanceType=='1'" class="top">
                <view class="title">{{ curLessonData.fullname }}</view>
                <view class="info">{{ `开课时间:  ${changeLessonDate(curLessonData.startdate)}-${changeLessonDate(curLessonData.enddate)}` }}</view>
                <view class="info">{{ `实际教学周数:  ${curLessonData.attendance?.config?.weeks}` }}</view>
                <view class="info">{{ `考勤类型:  按周参与活动记考勤` }}</view>
                <view class="info">{{ `周全勤天数要求:  ${curLessonData.attendance?.config?.day_pass}次/周` }}</view>
                <view class="info" style="display: flex">考勤合格标准: <rich-text style="padding-left: 10rpx" :nodes="curLessonData.attendanceRule" /></view>
            </view>
            <view v-if="curLessonData.attendanceType=='2'" class="top">
                <view class="title">{{ curLessonData.fullname }}</view>
                <view class="info">{{ `开课时间:  ${changeLessonDate(curLessonData.startdate)}-${changeLessonDate(curLessonData.enddate)}` }}</view>
                <view class="info">{{ `实际教学周数:  ${curLessonData.attendance?.config?.weeks}` }}</view>
                <view class="info">{{ `考勤类型:  按学习时长记考勤` }}</view>
                <view class="info">{{ `课程总在线时长:  ${curLessonData.attendance?.config?.attendanceTimer}分钟` }}</view>
                <view class="info">{{ `合格学习时长:  ${curLessonData.attendance?.config?.attendanceTimerMin}分钟` }}</view>
            </view>
        </view>
        <view class="select-container" @click="handleSelectGroup">
            <view>选择小组:</view>
            <view class="select-group"><text style="padding-right: 10rpx">请选择</text><uni-icons type="right" size="18" color="#9c9c9c"></uni-icons></view>
        </view>
        <data-picker ref="dataPickerRef" :localdata="curLessonData.groups" popup-title="请选择" :map="keyMap" @change="handleChange" @popupclosed="handleClose" />
    </view>
</template>
<script lang="ts" setup>
import { useLessonStore } from '@/store/modules/lesson';
import { changeLessonDate } from '@/utils';
import DataPicker from '@/components/data-picker/data-picker.vue';

const emit=defineEmits(['select-change']);
const useLesson=useLessonStore();
const curLessonData=computed(() => useLesson.lessonData);
const keyMap={text:'name',value:'id'};
const dataPickerRef=ref();


const handleSelectGroup = () => {
    dataPickerRef.value.handleInput();
};
const handleChange = (e) => {
    emit('select-change',e.detail.value[0].value);
};

</script>
<style lang="scss" scoped>
.top-info{
    padding: 20rpx;
}
.top{
    width: 100%;
    border-radius: 30rpx;
    background: linear-gradient(#3376b2, #2385c7);
    color: $uni-text-color-inverse;;
    padding: 20rpx 20rpx 40rpx 20rpx;
    position: relative;
  .title{
    font-size: $uni-font-size-m;
    padding-bottom: 10rpx;
  }
  .info{
    font-size: $uni-font-size-sm;
    padding-bottom: 4rpx;
  }
}
.top:after {
  content: "";
  position: absolute;
  bottom: -40rpx;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 40rpx 40rpx 0;
  border-color: #2583c4 transparent transparent;
}
.select-container{
    background-color: #fff;
    height: 80rpx;
    width: 100%;
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    align-items: center;
}
.select-group{
   display: flex;
    color: #9c9c9c;
    font-size: $uni-font-size-m;
    height: 100%;
    align-items: center;
}
</style>
