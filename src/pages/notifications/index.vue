
<template>
    <view>
        <logo-header />
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="notifications.map(item=>item.categoryName)" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <view>
            <uni-search-bar v-model="searchValue" placeholder="标题名称" bg-color="#FFFFFF" @confirm="search" @cancel="cancel"></uni-search-bar>
            <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" :list-data="dataState.listData" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
                <view>
                    <view v-for="(notice) in dataState.listData" :key="notice.informationId" class="notice">
                        <view class="notice-date">
                            <text class="notice-date-day">{{ formatCreateDate(notice.createDate).day }}</text>
                            <text class="notice-date-date">{{ formatCreateDate(notice.createDate).date }}</text>
                        </view>
                        <view class="notice-msg">
                            <uni-tag :inverted="true" text="置顶" size="mini" type="error" />
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
import {informationListApi, informationListCategoryApi} from '@/services/notifications';
import useRefreshList from '@/hooks/useRefreshList';
import {Toast} from '@/utils/uniapi/prompt';

const current = ref(0);
const searchValue = ref('');
const curNoticeTab = ref({});
const notifications = ref([]);
const searchParams = reactive({
    searchData:{

    },
    searchApi: informationListApi,
});
const { dataState,refresh,fetchList, loadMore, hasMore, loading,isRefresh,hasMoreLoading} = useRefreshList(searchParams);
const onClickItem =async (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    curNoticeTab.value=notifications.value[current.value];
    const {categoryId}=curNoticeTab.value;
    searchParams.searchData= {categoryId};
    await fetchList(searchParams);
};
const getNoticeTabs =async () => {
    const {data,success}=await informationListCategoryApi({parentId: 'tzgl'});
    if(success){
        notifications.value=data;
    }
};

const search = () => {
    if(!searchValue.value){
        Toast('请输入标题名称',{icon:'error'});
        return;
    }
    const {categoryId}=curNoticeTab.value;
    searchParams.searchData= {categoryId,title:searchValue.value};
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

onShow(async ()=>{
    current.value=0;
    await getNoticeTabs();
    curNoticeTab.value=notifications.value[current.value];
    const {categoryId}=curNoticeTab.value;
    searchParams.searchData= {categoryId};
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
