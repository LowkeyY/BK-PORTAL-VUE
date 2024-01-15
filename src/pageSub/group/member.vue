<template>
    <view class="main">
        <uni-title type="h3" :title="curGroupName" style="margin-bottom: 20rpx"></uni-title>
        <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" :list-data="dataState.listData" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
            <uni-list :border="false" class="list-box">
                <uni-list-chat
                    v-for="member in dataState.listData" :key="member.id" clickable :avatar-circle="true" ellipsis="1"
                    :title="member.fullname" :avatar="getImages(member.profileimageurl, 'defaultUserIcon')"
                    :note="member.roleName" style="margin-bottom: 20rpx;"
                    @click="handleMember(member)"
                >
                    <view class="chat-custom-right">
                        <button style="color: #fff;background: #2b83d7;border-radius: 8rpx;font-size: 24rpx;" size="mini" @click.stop="handleMessage(member)">
                            发消息
                        </button>
                    </view>
                </uni-list-chat>
            </uni-list>
        </pull-refresh-list>
    </view>
</template>

<script setup lang="ts">
import {useUserStore} from '@/store/modules/user';
import {groupListApi} from '@/services/list';
import useRefreshList from '@/hooks/useRefreshList';
import {handleJumpToPage} from '@/utils/handle';
import {getImages} from '@/utils';

const useUser = useUserStore();
const curGroupName = ref('');
const searchParams = reactive({
    searchData:{
        courseid:'',
        userid:useUser.moodleUserId
    },
    searchApi: groupListApi,
});
const { dataState,refresh,fetchList, loadMore, hasMore, loading,isRefresh,hasMoreLoading} = useRefreshList(searchParams);

const handleMember = (member) => {
    const {id}=member;
    handleJumpToPage('personnelMessage',{id});
};
const handleMessage = (member) => {
    console.log(member);
};

onLoad(async option => {
    const {courseid,groupName}=option;
    if(groupName){
        curGroupName.value=groupName;
    }
    searchParams.searchData={courseid,userid:useUser.moodleUserId};
    await fetchList(searchParams);
});
</script>

<style lang="scss" scoped>
.main {
  padding: $uni-container-padding;
}
.list-box {
  background-color: $uni-bg-color-grey;
}
</style>
