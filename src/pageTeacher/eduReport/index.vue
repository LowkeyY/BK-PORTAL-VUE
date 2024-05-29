<!--
 * @Author: Lowkey
 * @Date: 2024-05-21 12:01:26
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-21 13:35:27
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\eduReport\index.vue
 * @Description: 
-->
<template>
    <view>
        <nav-bar title="报表查询" />
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <view class="container">
            <view class="list-container">
                <view v-if="current === 0">
                    <view>
                        <view class="lesson-name">sdfsdfs</view>
                        <view class="date">
                            <text>{{ `开课日期：` }}</text>
                            <text>{{ `结课日期：` }}</text>
                        </view>
                        <uni-collapse ref="collapse" value="0">
                            <uni-collapse-item title="报表查询">
                                <uni-list>
                                    <uni-list-item v-for="(item, index) in reportList" :key="index" show-arrow :title="item.name" />
                                </uni-list>
                            </uni-collapse-item>
                        </uni-collapse>
                    </view>
                </view>
                <view v-if="current === 1">
                    <view>
                        <view class="lesson-name">sdfsdfs</view>
                        <view class="date">
                            <text>{{ `结课日期：` }}</text>
                        </view>
                        <uni-collapse ref="collapse" value="0">
                            <uni-collapse-item title="报表查询">
                                <uni-list>
                                    <uni-list-item v-for="(item, index) in afterReportList" :key="index" show-arrow :title="item.name" />
                                </uni-list>
                            </uni-collapse-item>
                        </uni-collapse>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { reportList, afterReportList } from '@/utils/constants';
const current = ref(0);
const courses = ref(['教学中', '结课后']);
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 10rpx 20rpx;
}
.uni-padding-wrap {
    background-color: #fff;
    margin-bottom: 10rpx;
}
.list-container {
    padding: 20rpx;
    background-color: #fff;
    border-radius: 8px;
    .lesson-name {
        font-size: $uni-font-size-lg;
        margin-bottom: 20rpx;
    }
    .date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $uni-font-size-m;
        color: $uni-color-subtitle;
    }
}
</style>
