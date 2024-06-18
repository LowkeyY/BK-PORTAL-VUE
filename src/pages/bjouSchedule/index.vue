<!--
 * @Author: Lowkey
 * @Date: 2024-05-13 16:59:25
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 20:06:36
 * @FilePath: \BK-Portal-VUE\src\pages\bjouSchedule\index.vue
 * @Description: 
-->

<template>
    <logo-header />
    <uni-calendar class="uni-calendar" :insert="true" :show-month="false" :selected="selected" @change="change" />
    <view class="content" :style="{ height: elementHeight }">
        <uni-section type="line" title="直播课程" />
        <view class="list-content">
            <view v-for="item in [1,2,3]" :key="item" class="list-item-course">
                <view class="title">{{ `形势与政策` }}</view>
                <view class="info-content">
                    <view class="info">
                        <view class="lecture">{{ `主讲教师：${'孔子'}` }}</view>
                        <view class="date">{{ `开始时间：${'2024.02.20'}` }}</view>
                    </view>
                    <view>
                        <button type="primary" plain="true" size="mini">
                            参与直播
                        </button>
                    </view>
                </view>
            </view>
        </view>

        <uni-section type="line" title="我的日程" />
        <view class="list-content">
            <view v-for="item in [1,2,3]" :key="item" class="list-item">
                <view class="title">毕业设计讨论</view>
                <view class="date">{{ `开始时间：${'2024.02.20'}` }}</view>
            </view>
        </view>
    </view>
   
    <tab-bar />
</template>
<script lang="ts" setup>
import { useSystem } from '@/hooks/app/useSystem';
import { px2rpx } from '@/utils/uniapi';

const _this = getCurrentInstance();
const elementHeight = ref('100%');
const getDate = (date, AddDayCount = 0) => {
    if (!date) {
        date = new Date();
    }
    if (typeof date !== 'object') {
        date = date.replace(/-/g, '/');
    }
    const dd = new Date(date);

    dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期

    const y = dd.getFullYear();
    const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
    const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
    return {
        fullDate: y + '-' + m + '-' + d,
        year: y,
        month: m,
        date: d,
        day: dd.getDay(),
    };
};
const selected = ref([
    {
        date: getDate(new Date()).fullDate,
    },
]);
const change = (date) => {
    console.log(date);
};
const setHeight=()=>{
    // 自适应容器高度
    setTimeout(() => {
        uni.createSelectorQuery()
            .in(_this)
            .select('.content')
            .boundingClientRect()
            .exec(res => {
                elementHeight.value = px2rpx(useSystem().windowHeight - res[0]?.top-50) + 'rpx';
            });
    }, 300);
};
onUpdated(()=>{
    setHeight();
});
onMounted(() => {
    setHeight();
});
</script>
<style lang="scss" scoped>
.uni-calendar {
  margin-bottom: 10rpx;
}
::v-deep .uni-calendar__header {
  height: 60rpx;
}
::v-deep .uni-calendar__backtoday {
  top: 0;
  height: 60rpx;
  line-height: 60rpx;
}
::v-deep .uni-calendar__header-btn-box {
  height: 60rpx;
}
::v-deep .uni-calendar__weeks-day {
  height: 60rpx;
}
::v-deep .uni-calendar-item__weeks-box-item {
  height: 60rpx;
}
.content {
  overflow-y: scroll;
}
.list-content {
  padding: 8rpx 20rpx 0;
  .list-item-course {
    background-color: #fff;
    padding: $uni-list-padding;
    margin-bottom: $uni-spacing-col-base;
    border-radius: $uni-border-radius-base;
    .title {
      font-size: $uni-font-size-lg;
      margin-bottom: $uni-spacing-col-base;
    }
    .info-content {
      @include flex;
      .info {
        @include info;
        .lecture {
          margin-bottom: $uni-spacing-col-base;
        }
      }
    }
  }
  .list-item {
    background-color: #fff;
    padding: $uni-list-padding;
    margin-bottom: $uni-spacing-col-base;
    border-radius: $uni-border-radius-base;
    .title {
      font-size: $uni-font-size-lg;
      margin-bottom: $uni-spacing-col-base;
    }
    .date {
      @include info;
    }
  }
}
</style>
