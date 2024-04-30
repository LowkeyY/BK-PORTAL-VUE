<!--
 * @Author: Lowkey
 * @Date: 2024-04-29 16:49:56
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-30 13:22:55
 * @FilePath: \BK-Portal-VUE\src\pageOuchn\index\index.vue
 * @Description: 
-->


<template>
    <view class="constainer">
        <logo-header /> 
        <view class="grid-container">
            <uni-grid :column="4" :show-border="false" :square="false">
                <uni-grid-item v-for="(item ,index) in gkStudentGirds" :key="item.id" :index="index" @click="()=>handleGridsClick(item)">
                    <view class="grid-item-box">
                        <image class="image" :src="`/static/images/gridsGk/${item.icon}.png`" mode="aspectFill" />
                        <text class="text">{{ item.text }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>
        <uni-section type="line" title="通知公告" />
        <pull-refresh-list :loading="loading" :list-data="dataState.listData" :has-more="hasMore" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" @on-refresh="refresh" @load-more="loadMore">
            <view class="notice-content">
                <view v-for="(notice) in dataState.listData" :key="notice.informationId" class="notice" @click="goDetail(notice)">
                    <view class="notice-msg">
                        <uni-tag v-if="notice.isTop===1" :inverted="true" text="置顶" size="mini" type="error" />
                        <view class="notice-text text-ellipsis-1">
                            <text class="notice-source">
                                {{ `[${notice.informationSource}]` }}
                            </text>
                            <text class="notice-text">
                                {{ notice.title }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
    <tab-bar />
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import {gkStudentGirds} from '@/utils/constants';
import {informationListApi} from '@/services/notifications';
import {handleGridsClick,handleJumpToPage} from '@/utils/handle';
import useRefreshList from '@/hooks/useRefreshList';

const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();
const params:any = reactive({
    searchData:{
        categoryId: 'gktzgg'
    },
    searchApi: informationListApi,
});

const { dataState,refresh, loadMore, hasMore, isRefresh,loading ,hasMoreLoading} = useRefreshList(params);

const goDetail = (notice:Record<string,any>) => {
    const {informationId,categoryName}=notice;
    handleJumpToPage('informationDetail',{informationId,categoryName});

};
const init =async ()=>{
    await useUser.queryPortalUserInfoApi();
};

onShow(()=>{
    init();
});
</script>
<style lang="scss" scoped>
.constainer {
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
    padding: 15px 0;
    .image {
      width: 56rpx;
      height: 56rpx;
    }
    .text {
      margin-top: 20rpx;
      font-size: 22rpx;
      color: $uni-text-color;
    }
  }
  .notice-content {
    margin-top: 10rpx;
    .notice {
      padding: 30rpx 20rpx;
      background-color: #fff;
      border-bottom: 1px solid $uni-border-color;
      .notice-source {
        color: $uni-color-primary;
        margin-right: 20rpx;
      }
    }
  }
}

</style>
