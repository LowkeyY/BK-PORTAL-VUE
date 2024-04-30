
<template>
    <view>
        <view>
            <uni-search-bar v-model="searchValue" placeholder="标题名称" bg-color="#FFFFFF" @confirm="search" @cancel="cancel"></uni-search-bar>
            <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" :list-data="dataState.listData" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
                <view>
                    <view v-for="(notice) in dataState.listData" :key="notice.informationId" class="notice" @click="goDetail(notice)">
                        <view class="notice-date">
                            <text class="notice-date-day">{{ formatCreateDate(notice.createDate).day }}</text>
                            <text class="notice-date-date">{{ formatCreateDate(notice.createDate).date }}</text>
                        </view>
                        <view class="notice-msg">
                            <uni-tag v-if="notice.isTop===1" :inverted="true" text="置顶" size="mini" type="error" />
                            <text class="notice-text">
                                {{ notice.title }}
                            </text>
                        </view>
                    </view>
                </view>
            </pull-refresh-list>
        </view>
    </view>
</template>

<script setup lang="ts">
import {informationListApi} from '@/services/notifications';
import useRefreshList from '@/hooks/useRefreshList';
import {Toast} from '@/utils/uniapi/prompt';
import {handleJumpToPage} from '@/utils/handle';
import { uni } from '@dcloudio/uni-h5';

const searchValue = ref('');
const categoryId = ref('');
const searchParams = reactive({
    searchData:{},
    searchApi: informationListApi,
});
const { dataState,refresh,fetchList, loadMore, hasMore, loading,isRefresh,hasMoreLoading} = useRefreshList(searchParams,{immediate:false});

const search = () => {
    if(!searchValue.value){
        Toast('请输入标题名称',{icon:'error'});
        return;
    }
    // const {categoryId}=curNoticeTab.value;
    searchParams.searchData= {categoryId:categoryId.value,title:searchValue.value};
    fetchList(searchParams);
};

const cancel = () => {
    const { searchData } = searchParams;
    if(searchData.title){
        delete searchData.title;
    }
    fetchList(searchParams);
};
const formatCreateDate = (createDate) => {
    const day = new Date(createDate).getDate() < 10 ? `0${new Date(createDate).getDate()}` : new Date(createDate).getDate();
    const date = (new Date(createDate).getMonth() + 1) < 10 ? `${new Date(createDate).getFullYear()}.0${new Date(createDate).getMonth() + 1}` : `${new Date(createDate).getFullYear()}.${new Date(createDate).getMonth() + 1}`;
    return {day,date};
};

const goDetail = (notice) => {
    const {informationId,categoryName}=notice;
    handleJumpToPage('informationDetail',{informationId,categoryName});

};

onLoad(async (options)=>{
    if(options){
        uni.setNavigationBarTitle({
            title:options.text
        });
        searchParams.searchData= {categoryId:options.queryType};
    }
    
    categoryId.value=options.queryType;
    await fetchList(searchParams);
});
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  padding: 0 20rpx 10rpx;
}
.notice {
  display: flex;
  background-color: #fff;
  padding: 10rpx 30rpx;
  margin-bottom: 20rpx;
  align-items: center;
  .notice-date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #2b83d7;
    padding: 20rpx 10rpx;
    .notice-date-day {
      color: $uni-font-color-white;
      font-size: $uni-font-size-lg;
    }
    .notice-date-date {
      color: $uni-font-color-white;
      font-size: $uni-font-size-base;
    }
  }
  .notice-msg {
    flex-grow: 1;
    padding: 0 20rpx;
    .notice-text {
      padding-left: 10rpx;
    }
  }
}
</style>
