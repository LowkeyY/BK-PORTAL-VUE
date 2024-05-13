<!--
 * @Author: Lowkey
 * @Date: 2024-01-17 15:08:56
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-18 13:50:57
 * @FilePath: \BK-Portal-VUE\src\pageSub\messageCenter\components\PrivateLetter.vue
 * @Description:
-->
<template>
    <view>
        <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :list-data="dataState.listData" :is-refresh="isRefresh" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
            <uni-list v-for="(item) in dataState.listData" :key="item.id" :border="true">
                <uni-list-chat
                    clickable :title="item.userName" :avatar="getImages(item.avatar,'user')"
                    :note="item.smallmessage" :time="getMessageTime(item.timecreated)"
                    badge-positon="left" :badge-text="item.unread?'dot':''"
                    @click="goChatDetail(item)"
                />
            </uni-list>
        </pull-refresh-list>
    </view>
</template>

<script lang="ts" setup name="PrivateLetter">
import {privateMessageApi} from '@/services/message';
import {useUserStore} from '@/store/modules/user';
import useRefreshList from '@/hooks/useRefreshList';
import {getMessageTime,getImages} from '@/utils';
import {handleJumpToPage} from '@/utils/handle';
const useUser = useUserStore();
const searchParams:any = reactive({
    searchApi: privateMessageApi,
    searchData:{
        userid:useUser.moodleUserId,
    },
});
const { dataState,refresh,loadMore, hasMore,isRefresh, loading ,hasMoreLoading} = useRefreshList(searchParams,{dataKey:'listData'});
const goChatDetail = (item) => {
    const {userName,useridfrom,avatar}=item;
    handleJumpToPage('chatDetail',{userName,useridfrom,avatar});
};
</script>

