
<template>
    <view>
        <view>
            <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" :list-data="otherData.mentors" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
                <view>
                    <view v-for="(teacher) in otherData.mentors" :key="teacher.id" class="item-box">
                        <uni-title
                            type="h4"
                            :title="teacher.fullname"
                            color="#2B83D7" class="item-title"
                        >
                        </uni-title>
                        <uni-list class="list-box">
                            <view v-if="teacher.master?.length>0">
                                <uni-list-chat
                                    v-for="master in teacher.master"
                                    :key="master.id" clickable :avatar-circle="true" ellipsis="1"
                                    :title="master.fullname" :avatar="getImages(master.avatar, 'defaultUserIcon')"
                                    note="责任教师"
                                    @click="handleTeacher(master)"
                                >
                                    <view class="chat-custom-right">
                                        <button style="color: #fff;background: #2b83d7;border-radius: 8rpx;font-size: 24rpx;" size="mini" @click.stop="handleMessage(member)">
                                            发消息
                                        </button>
                                    </view>
                                </uni-list-chat>
                            </view>
                            <text v-else>责任教师：未知</text>
                            <view v-if="teacher.mentors?.length>0">
                                <uni-list-chat
                                    v-for="mentor in teacher.mentors"
                                    :key="mentor.id" clickable :avatar-circle="true" ellipsis="1"
                                    :title="mentor.userData?.fullname" :avatar="getImages(mentor.userData?.profileimageurl, 'defaultUserIcon')"
                                    :note="mentor.roleData?.roleName"
                                    @click="handleTeacher(mentor)"
                                >
                                    <view class="chat-custom-right">
                                        <button class="btn" size="mini" @click.stop="handleMessage(mentor)">
                                            发消息
                                        </button>
                                    </view>
                                </uni-list-chat>
                            </view>
                        </uni-list>
                    </view>
                </view>
            </pull-refresh-list>
        </view>
    </view>
</template>

<script setup lang="ts">
import useRefreshList from '@/hooks/useRefreshList';
import {handleJumpToPage} from '@/utils/handle';
import {myTeacherListApi} from '@/services/list';
import {useUserStore} from '@/store/modules/user';
import {getImages} from '@/utils';

const useUser = useUserStore();
const searchParams = reactive({
    searchData:{
        userid: useUser.moodleUserId
    },
    searchApi: myTeacherListApi,
});
const { dataState,refresh,fetchList, loadMore, hasMore, loading,isRefresh,hasMoreLoading,otherData} = useRefreshList(searchParams);

const handleTeacher = (member) => {
    const {id}=member;
    handleJumpToPage('personnelMessage',{id});
};

const handleMessage = (member) => {
    console.log(member);
};

onLoad(async ()=>{
    await fetchList(searchParams);
});
</script>

<style lang="scss" scoped>
.item-box {
  background-color: #fff;
  margin: $uni-list-padding;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 20rpx;
}
.btn {
  color: #fff;
  background: #2b83d7;
  border-radius: 8rpx;
  font-size: 24rpx;
}
</style>
