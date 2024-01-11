<!--
 * @Author: Lowkey
 * @Date: 2024-01-08 13:59:08
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-11 12:12:59
 * @FilePath: \BK-Portal-VUE\src\pageSub\achievement\details.vue
 * @Description: 
-->

<template>
    <view>
        <nav-bar title="" />
       
        <view class="header">
            <view class="header-title">{{ otherData.coursename }}</view>
            <view class="header-grade">
                <view>
                    <text class="name">课程总分：</text>
                    <text>{{ `${otherData.grademax||'-'}` }}</text>
                </view>
                <view>
                    <text class="name">我的总分：</text>
                    <text>{{ `${otherData.graderaw||'-'}` }}</text>
                </view>
            </view>
        </view>
        <view class="content">
            <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :list-data="dataState.listData" :is-refresh="isRefresh" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
                <view>
                    <view v-for="(item,index) in dataState.listData" :key="item.id||`${item.type}_${index}`" class="card" @click="()=>handleListClick(item)">
                        <view class="card-header">
                            <view class="type-content">
                                <resource-icon :type="item.itemType" /> 
                                <view class="type">{{ getType(item.itemType) }}</view>
                            </view>
                            <view class="end-date">
                                {{ `截止时间:${item.enddate>0?getCommonDate(item.enddate):'未设置'}` }}
                            </view>
                        </view>
                        <view class="info">
                            <view :class="['my-grade',item.id ===''&&'disabled']">
                                {{ item.title }}
                            </view>
                            <view class="grade-box">
                                <view>{{ `总分：${item.grademax}` }}</view>
                                <view :class="['my-grade',item.id ===''&&'disabled']">{{ `我的得分${item.grade||'-'}` }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </pull-refresh-list>
        </view>
    </view>
</template>

<script lang="ts" setup>
import {gradeDetailsApi} from '@/services/list';
import {useUserStore} from '@/store/modules/user';
import {getCommonDate} from '@/utils';
import {resourceType} from '@/utils/constants';
import {handleJumpToPage} from '@/utils/handle';
import useRefreshList from '@/hooks/useRefreshList';

const useUser = useUserStore();
const searchParams:any = reactive({
    searchData:{
        userid:useUser.moodleUserId,
    },
    searchApi: gradeDetailsApi
});
const { searchState,dataState,fetchList,refresh,loadMore,otherData, hasMore,isRefresh, loading ,hasMoreLoading} = useRefreshList(searchParams, {immediate:false});

const getType = (type:string):string => {
    return resourceType[type]||'-';
};

const handleListClick = (cur:Record<string,any>)=>{
    const {id} = cur;
    console.log(id);
    // handleJumpToPage('achievementDetails',{courseid:id});
};
onLoad((option) => {
    if (option) {
        const {courseid} = option;
        searchParams.searchData=Object.assign(searchParams.searchData,{courseid});
        fetchList(searchState);
    }
});
</script>

<style lang="scss" scoped>
.header {
  background-color: $uni-color-primary;
  padding: 0 20rpx 30rpx;
  color: $uni-font-color-white;
  .header-title {
    font-size: $uni-font-size-lg;
  }
  .header-grade {
    display: flex;
    justify-content: space-between;
    padding-top: $uni-spacing-row-lg;
    text-align: right;
    font-size: $uni-font-size-lg;
    .name {
      font-size: $uni-font-size-base;
    }
  }
}
.content {
  padding: $uni-container-padding;
  .card {
    padding: $uni-list-padding;
    background-color: #fff;
    margin-bottom: $uni-spacing-col-lg;
    border-radius: $uni-border-radius-lg;
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: $uni-spacing-col-lg;
      border-bottom: 1px solid $uni-border-color;
      .type-content {
        display: flex;
        align-items: center;
        .icon {
          width: 36rpx;
          height: 36rpx;
        }
        .type {
          margin-left: 8rpx;
          font-size: $uni-font-size-m;
        }
      }
      .end-date {
        font-size: $uni-font-size-sm;
        color: $uni-color-subtitle;
      }
    }
    .info {
      margin-top: $uni-spacing-col-lg;
      font-size: $uni-font-size-m;
      .grade-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $uni-font-size-base;
        margin-top: $uni-spacing-col-lg;
        color: $uni-color-subtitle;
        .my-grade {
          color: $uni-color-primary;
        }
        .disabled {
          @include disabled ;
        }
      }
    }
  }
}

</style>
