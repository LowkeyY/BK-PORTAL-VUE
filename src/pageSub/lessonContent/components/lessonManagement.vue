<!--
 * @Author: Lowkey
 * @Date: 2024-01-24 18:50:11
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-29 19:18:00
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\lessonManagement.vue
 * @Description: 
-->

<template>
    <view>
        <view class="grid-container">
            <uni-grid :column="3" :show-border="false" :highlight="true" :square="false">
                <uni-grid-item v-for="(item, index) in grids" :key="item.id" :index="index" @click="() => handleGridsClick(item)">
                    <view class="grid-item-box">
                        <image class="image" :src="`/static/images/grids/${item.icon}.svg`" mode="aspectFill" />
                        <text class="text">{{ item.text }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
            <uni-section type="line" title="报表查询" />
            <uni-list>
                <uni-list-item v-for="(item, index) in report" :key="index" clickable show-arrow :title="item.name" @click="handleReportList(item)" />
            </uni-list>
        </view>
    </view>
</template>
<script lang="ts" setup name="LessonManagement">
import { handleGridsClick, handleJumpToPage } from '@/utils/handle';
import { useLessonStore } from '@/store/modules/lesson';
import { reportList, afterReportList } from '@/utils/constants';
import { getCurPageParam } from '@/utils';
const pageParams = getCurPageParam();
const { courseid } = pageParams;
const useLesson = useLessonStore();
const report: any = computed(() => {
    if (useLesson.lessonData.openState === '0') {
        return reportList;
    }
    return afterReportList;
});

const grids = [
    {
        id: '1',
        icon: 'suggestion',
        text: '学生反馈',
        path: 'StudentSuggestions',
        courseid,
    },
    {
        id: '2',
        icon: 'class',
        text: '小组成员',
        path: 'GroupMembers',
        courseid,
    },
    {
        id: '3',
        icon: 'grade',
        text: '学生成绩',
        path: 'AchievementReport',
        courseid,
    },
];
const handleReportList = (item: Record<string, string>) => {
    const { path = '' } = item;
    handleJumpToPage(path, { courseid });
};
</script>
<style lang="scss" scoped>
.grid-container {
    background-color: #fff;
}
.grid-item-box {
    flex: 1;
    // position: relative;

    /* #ifndef APP-NVUE */
    display: flex;

    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    .image {
        width: 80rpx;
        height: 80rpx;
    }
    .text {
        margin-top: 20rpx;
        font-size: $uni-font-size-sm;
        color: $uni-text-color;
    }
}
</style>
