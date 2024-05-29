<template>
    <app-provider>
        <nav-bar :title="name" />
        <ComSkeleton type="text" :loading="useFeedback.questionLoading">
            <view>
                <uni-card v-for="item in getAnswer" :key="item.id" :title="item.name">
                    <text class="uni-body">{{ item.printval }}</text>
                </uni-card>
            </view>
        </ComSkeleton>
    </app-provider>
</template>

<script setup lang="ts">
import {getCurPageParam} from '@/utils';
import {useFeedbackStore} from '@/store/modules/feedback';

const useFeedback=useFeedbackStore();
const {anonymous,id,name} = getCurPageParam();
const resultData=computed(() => useFeedback.responseData);

const getAnswer=()=>{
    const { anonattempts, attempts } = resultData.value;
    if (anonymous === '2') {
        return attempts.find(item => item.id == id).responses;
    } else if (anonymous === '1') {
        return anonattempts.find(item => item.id == id).responses;
    }
    return [];
};
</script>

