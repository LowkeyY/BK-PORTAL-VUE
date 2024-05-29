<template>
    <app-provider>
        <nav-bar title="回复" />
        <ComSkeleton type="text" :loading="useFeedback.responseLoading">
            <view class="container">
                <view v-if="anonymous == 1 && resultData.groups.length > 0" class="group">
                    <view>小组：</view>
                    <view style="width: 40%;">
                        <uni-data-picker
                            v-model="groupid" placeholder="所有成员" popup-title="请选择"
                            :localdata="formatGroups(resultData.groups)" @change="handleChange"
                        >
                        </uni-data-picker>
                    </view>
                </view>
                <uni-section :title="anonymous === '1' ? '匿名条目' : '非匿名条目'" type="line"></uni-section>
                <pull-refresh-list
                    :loading="loading" :has-more="false" :list-data="resultData.anonattempts" :is-refresh="isRefresh"
                    @on-refresh="handleRefresh"
                >
                    <view v-if="isArray(resultData.anonattempts)">
                        <uni-list>
                            <uni-list-item
                                v-for="item in resultData.anonattempts" :key="item.id"
                                clickable show-arrow :title=" anonymous == '1'?`答复编号${item.number}`:`${item.fullname}`"
                                @click="handleDetail(item)"
                            />
                        </uni-list>
                    </view>
                </pull-refresh-list>
            </view>
        </ComSkeleton>
    </app-provider>
</template>

<script setup lang="ts">
import {getCurPageParam} from '@/utils';
import {useFeedbackStore} from '@/store/modules/feedback';
import {isArray} from '@/utils/is';
import {useUserStore} from '@/store/modules/user';
import {handleJumpToPage} from '@/utils/handle';

const {anonymous,cmid,id} = getCurPageParam();
const useFeedback=useFeedbackStore();
const useUser=useUserStore();
const groupid=ref(0);
const loading=ref(false);
const isRefresh=ref(false);
const resultData=computed(() => useFeedback.responseData);


const formatGroups = (groups) => {
    const arr = [{ text: '所有成员', value: 0 }];
    isArray(groups) && groups
        .map((data, i) => {
            arr.push({
                text: data.name,
                value: data.id
            });
        });
    return arr;
};


const handleRefresh =async () => {
    const curParams={
        userid:useUser.moodleUserId,
        groupid:groupid.value,
        anonymous,
        cmid,
        id
    };
    await useFeedback.queryResponseFeedbackQuestion(curParams);
};

const handleChange = (e) => {
    groupid.value=e.detail.value[0].value;
    handleRefresh();
};

const handleDetail = (item) => {
    const curParams={
        id:item.id,
        anonymous,
        name:anonymous == '1'?`答复编号${item.number}`:`${item.fullname}`
    };
    handleJumpToPage('feedbackResultDetails',curParams);
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
::v-deep .uni-section .uni-section-header{
    padding-left: 0;
}
</style>
