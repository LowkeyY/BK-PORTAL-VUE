<!--
 * @Author: Lowkey
 * @Date: 2024-05-21 17:01:27
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-22 11:17:56
 * @FilePath: \BK-Portal-VUE\src\pageSub\messageCenter\components\SuggestionList.vue
 * @Description: 
-->
<template>
    <view>
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :list-data="list"
            :is-refresh="isRefresh"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view class="container" @click="handleReplySuggestion">
                <view v-for="item in list" :key="item.opinionId" class="list">
                    <view class="list-info">
                        <text>{{ item.submitUserName }}</text>
                        <uni-tag
                            :text="item.currentStatus === '0' ? '未回复' : '已回复'"
                            :type="item.currentStatus === '0' ? 'error' : 'success'"
                            size="mini"
                        ></uni-tag>
                    </view>
                    <view class="list-content text-ellipsis-1">{{ item.submitContent }}</view>
                    <view class="list-date">
                        <uni-tag :text="item.submitType" type="primary" size="mini"></uni-tag>
                        <text>
                            {{ getCommonDate(item.submitDate) }}
                        </text>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script lang="ts" setup name="Activity">
import { activityMessageApi } from '@/services/message';
import { useUserStore } from '@/store/modules/user';
import useRefreshList from '@/hooks/useRefreshList';
import { getCommonDate } from '@/utils';
import { handleJumpToPage } from '@/utils/handle';

const useUser = useUserStore();
const searchParams: any = reactive({
    searchApi: activityMessageApi,
    searchData: {
        userid: useUser.moodleUserId,
    },
});
const { dataState, refresh, loadMore, hasMore, isRefresh, loading, hasMoreLoading } = useRefreshList(searchParams);
const handleReplySuggestion = () => {
    handleJumpToPage('SuggestionForm');
};
const list = [
    {
        opinionId: 1,
        currentStatus: '0',
        submitType: '课程内容',
        submitDate: '',
        submitUserName: 'Taylor',
        courseName: '线性代数',
        submitContent: '欲买桂花同载酒，',
    },
];
</script>

<style lang="scss" scoped>
.list {
    background-color: #fff;
    padding: $uni-list-padding;
    display: flex;
    flex-direction: column;
    margin-top: $uni-spacing-row-base;
    .list-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $uni-font-size-lg;
        margin-bottom: $uni-spacing-row-base;
    }
    .list-content {
        font-size: $uni-font-size-m;
        color: $uni-color-subtitle;
        margin-bottom: $uni-spacing-row-base;
    }
    .list-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $uni-font-size-m;
        color: $uni-color-subtitle;
    }
}
</style>
