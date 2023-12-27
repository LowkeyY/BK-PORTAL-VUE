<template>
    <view>
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="button" active-color="#2b83d7" @clickItem="onClickItem" />
        </view>
    </view>
</template>

<script setup lang="ts">
const current = ref(0);
const courses = ['在开课程', '已开课程'];
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    console.log(current.value);
};
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
    padding: 10rpx 20rpx;
}
</style>
