<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 13:34:50
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-28 13:20:49
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\groupMembers\index.vue
 * @Description: 
-->
<template>
    <nav-bar title="小组成员" />
    <view>
        <group-select />
        <dropdown v-model:menuList="dropList" title="成员列表" :duration="300" :is-ceiling="false" @on-confirm="onConfirm" />
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            :list-data="dataState.listData"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view class="group-container">
                <view v-for="item in dataState.listData" :key="item.id" class="group-list" @click="goDetail(item)">
                    <view class="title">
                        <view class="userName">李清照</view>
                        <view class="student-number">学号：23423423</view>
                    </view>
                    <view class="group-bottom">
                        <view class="user-info">
                            <view class="phone">
                                {{ `电话：${`123123123123`}` }}
                            </view>
                            <view class="email">
                                {{ `邮箱${`234@qq.com`}` }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';

const searchParams: any = reactive({
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
const dropList = ref([
    {
        title: '默认排序',
        type: 'cell',
        value: '0',
        options: [
            {
                label: '默认排序',
                value: '0',
            },
            {
                label: '上次访问时间正序',
                value: '1',
            },
            {
                label: '上次访问时间倒序',
                value: '2',
            },
        ],
    },
]);
const onConfirm = (e) => {};
const goDetail = (item) => {};
</script>
<style lang="scss" scoped>
.group-container {
    padding: 10rpx 20rpx;
}
.group-list {
    background-color: #fff;
    padding: $uni-list-padding;
    margin-bottom: $uni-spacing-col-lg;
    border-radius: $uni-border-radius-base;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $uni-spacing-col-base;
        .userName {
            @include user-name;
        }
        .student-number {
            @include info;
        }
    }
    .group-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .user-info {
            font-size: $uni-font-size-base;
            color: $uni-color-subtitle;
            .phone {
                margin-bottom: $uni-spacing-col-base;
            }
        }
    }
}
</style>
