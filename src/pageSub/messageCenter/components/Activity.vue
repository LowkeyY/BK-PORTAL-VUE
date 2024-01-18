<!--
 * @Author: Lowkey
 * @Date: 2024-01-17 15:08:56
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-17 17:47:47
 * @FilePath: \BK-Portal-VUE\src\pageSub\messageCenter\components\Activity.vue
 * @Description: 
-->
<template>
    <view>
        <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :list-data="dataState.listData" :is-refresh="isRefresh" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
            <view class="container">
                <view v-for="(item) in dataState.listData" :key="item.id" class="list">
                    <view class="list-title">
                        <uni-tag v-if="item?.state === 'unread' " :circle="true" text="未读" type="error" size="mini" />
                        {{ item.name }}
                    </view> 
                    <text class="list-date">
                        {{ getCommonDate(item.timecreated) }}
                    </text>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script lang="ts" setup name="Activity">
import {activityMessageApi} from '@/services/message';
import {useUserStore} from '@/store/modules/user';
import useRefreshList from '@/hooks/useRefreshList';
import {getCommonDate} from '@/utils';
const useUser = useUserStore();
const searchParams:any = reactive({
    searchApi: activityMessageApi,
    searchData:{
        userid:useUser.moodleUserId,
    },
});
const { dataState,refresh,loadMore, hasMore,isRefresh, loading ,hasMoreLoading} = useRefreshList(searchParams);

</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  margin-bottom: $uni-spacing-row-base;
  padding: $uni-list-padding;
  display: flex;
  flex-direction: column;
  .list-title {
    font-size: $uni-font-size-lg;
    font-weight: 500;
    color: $uni-color-title;
    margin-bottom: 20rpx;
  }
  .list-date {
    font-size: $uni-font-size-base;
    text-align: right;
    color: $uni-color-subtitle;
  }
}
</style>
