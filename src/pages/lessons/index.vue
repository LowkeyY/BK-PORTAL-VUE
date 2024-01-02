<template>
    <view>
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="button" active-color="#2b83d7" @clickItem="onClickItem" />
        </view>
        <ComSkeleton type="list" :loading="skeletonLoading">
            <view></view>
        </ComSkeleton>
    </view>
</template>

<script setup lang="ts">
import ComSkeleton from '@/components/ComSkeleton/index.vue';
import {useAppStore} from '@/store/app';
import {courseListDueApi, courseListOpenApi} from '@/services/lesson';
import {useUserStore} from '@/store/modules/user';

const appStore = useAppStore();
const useUser = useUserStore();
const current = ref(0);
const skeletonLoading = ref(false);
const courses = ['在开课程', '已开课程'];
const params = reactive({
    userId:useUser.moodleUserId,
    value:appStore.courseid,
    nowPage:1,
    pageSize:10
});
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    console.log(current.value);
};


onShow(async ()=>{
    let res=courseListOpenApi(params);
    console.log(res);
});

</script>

<style lang="scss" scoped>
.uni-padding-wrap {
    padding: 10rpx 20rpx;
}
</style>
