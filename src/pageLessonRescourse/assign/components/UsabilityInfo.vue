
<template>
    <view class="contaner">
        <uni-list :border="false">
            <uni-list-item v-if="duedate > 0" :show-extra-icon="true">
                <template #header>
                    <view class="slot-box">
                        <image class="icon" src="@/static/svg/assignStatus/enddate.svg" mode="widthFix"></image>
                        <text>截止时间</text>
                    </view>
                </template>
                <template #footer>
                    <view class="date">
                        {{ getCommonDate(duedate) }}
                    </view>
                </template>
            </uni-list-item>
            <uni-list-item v-if="extensionduedate > 0" :show-extra-icon="true">
                <template #header>
                    <view class="slot-box">
                        <image class="icon" src="@/static/svg/assignStatus/enddate.svg" mode="widthFix"></image>
                        <text>宽限时间</text>
                    </view>
                </template>
                <template #footer>
                    <view class="date">
                        {{ getCommonDate(extensionduedate) }}
                    </view>
                </template>
            </uni-list-item>
            <uni-list-item v-if="duedate > 0" :show-extra-icon="true">
                <template #header>
                    <view class="slot-box">
                        <image class="icon" src="@/static/svg/assignStatus/surplus.svg" mode="widthFix"></image>
                        <text>剩余时间</text>
                    </view>
                </template>
                <template #footer>
                    <view class="date" :style="getStyle(submitStatus, duedate, timemodified)">
                        {{ getSurplusDay(extensionduedate > duedate ? extensionduedate : duedate, submitStatus, timemodified) }}
                    </view>
                </template>
            </uni-list-item>
            <uni-list-item :show-extra-icon="true">
                <template #header>
                    <view class="slot-box">
                        <image class="icon" src="@/static/svg/assignStatus/modify.svg" mode="widthFix"></image>
                        <text>最后修改</text>
                    </view>
                </template>
                <template #footer>
                    <view class="date">
                        {{ getCommonDate(timemodified) }}
                    </view>
                </template>
            </uni-list-item>
        </uni-list>
    </view>
</template>

<script setup name="UsabilityInfo" lang="ts">
import {getCommonDate,getSurplusDay} from '@/utils';
const props = defineProps({
    data: {
        type: Object,
        default: ()=>{}
    }
});
const { submitStatus, gradingstatus, duedate = 0, extensionduedate = 0, timemodified = 0} = toRefs(props.data);

const getStyle = (type:string, data:number, timemodified = 0) => {
    if (type === 'submitted') {
        if (data * 1000 < new Date().getTime() && data > timemodified) {
            return { color: '#1eb259' };
        } else if (data * 1000 < new Date().getTime() && data < timemodified) {
            return { color: '#f34e14' };
        }
        return null;
    }
    return null;
};


</script>

<style lang="scss" scoped>
.contaner {
  .slot-box {
    display: flex;
    align-items: center;
    font-size: $uni-font-size-base;
    color: $uni-color-subtitle;
    .icon {
      width: 1.2em;
      height: 1.2em;
      margin-right: 10rpx;
    }
  }
  .date {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }
}
</style>