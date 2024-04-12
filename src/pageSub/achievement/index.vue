<!--
 * @Author: Lowkey
 * @Date: 2024-01-05 16:11:32
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-08 16:20:01
 * @FilePath: \BK-Portal-VUE\src\pageSub\achievement\index.vue
 * @Description:
-->

<template>
    <view>
        <nav-bar title="我的成绩" />
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :list-data="dataState.listData"
            :is-refresh="isRefresh"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view>
                <view v-for="curLesson in dataState.listData" :key="curLesson.id" class="lesson" @click="() => handleListClick(curLesson)">
                    <h4 class="lesson-title">{{ curLesson.fullname }}</h4>
                    <view class="lesson-content">
                        <view class="lesson-img">
                            <img
                                :src="getImages(curLesson.courseImage)"
                                style="width: 100%; height: 100%"
                                mode="scaleToFill"
                                @error="(el) => getErrorImg(el, 'user')"
                            />
                        </view>
                        <view class="lesson-info">
                            <view>
                                {{ curLesson.openState === '0' ? `结课日期：${changeLessonDate(curLesson.enddate) || '-'}` : '已结束' }}
                            </view>
                            <view>
                                {{ `课程总得分：${curLesson.graderaw || '-'}` }}
                            </view>
                            <view v-if="curLesson.openState !== '0'">
                                <uni-tag
                                    :text="isPass(curLesson.graderaw) ? GradeEnums.PASSED : GradeEnums.NO_PASS"
                                    :type="isPass(curLesson.graderaw) ? 'success' : 'error'"
                                    size="small"
                                />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script lang="ts" setup>
import { gradeListApi } from '@/services/list';
import { useUserStore } from '@/store/modules/user';
import { getImages, changeLessonDate, getErrorImg } from '@/utils';
import { GradeEnums } from '@/enums/statusEnum';
import { handleJumpToPage } from '@/utils/handle';
import useRefreshList from '@/hooks/useRefreshList';

const useUser = useUserStore();
const searchParams: any = reactive({
    searchData: {
        userid: useUser.moodleUserId,
    },
    searchApi: gradeListApi,
});
const { dataState, refresh, loadMore, hasMore, isRefresh, loading, hasMoreLoading } = useRefreshList(searchParams);

const isPass = (grade: number): boolean => grade >= 60;

const handleListClick = (curLesson: Record<string, any>) => {
    const { id } = curLesson;
    handleJumpToPage('achievementDetails', { courseid: id });
};
</script>

<style lang="scss" scoped>
.lesson {
    background-color: #fff;
    margin-top: 20rpx;
    padding: $uni-list-padding;
    .lesson-title {
        font-size: $uni-font-size-lg;
        color: $uni-color-title;
        font-weight: 600;
    }
    .lesson-content {
        padding: 10rpx 0;
        display: flex;
        .lesson-img {
            width: 40%;
            height: 160rpx;
            border-radius: 20rpx;
            overflow: hidden;
        }
        .lesson-info {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            font-size: $uni-font-size-base;
            margin-left: $uni-spacing-col-lg;
            color: $uni-color-subtitle;
        }
    }
}
</style>
