<!--
 * @Author: Lowkey
 * @Date: 2024-05-13 16:56:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-13 09:33:22
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\teacherSchedule\index.vue
 * @Description: 
-->

<template>
    <view>
        <logo-header class="logo" />
        <!-- <web-view
            :style="{ top, height: elementHeight }"
            class="web-container"
            src="https://www.runoob.com/sass/sass-tutorial.html"
            :webview-styles="{
                progress: {
                    color: '#2b83d7',
                },
            }"
        ></web-view> -->
    </view>
    <tab-bar class="tabbar" />
</template>
<script lang="ts" setup>
const _this = getCurrentInstance();
import { px2rpx } from '@/utils/uniapi';
const top = ref('0rpx');
const elementHeight = ref('100%');
const setTop = () => {
    setTimeout(() => {
        uni.getSystemInfo({
            success: () => {
                uni.createSelectorQuery()
                    .select('.logo')
                    .boundingClientRect()
                    .exec((res) => {
                        top.value = px2rpx(res[0]?.bottom) + 'rpx';
                    });
            },
        });
    }, 300);
};
const setHeight = () => {
    // 自适应容器高度
    setTimeout(() => {
        uni.getSystemInfo({
            success: (info) => {
                uni.createSelectorQuery()
                    .in(_this)
                    .select('.web-container')
                    .boundingClientRect()
                    .exec((res) => {
                        elementHeight.value = px2rpx(info.windowHeight - res[0]?.top - 50) + 'rpx';
                    });
            },
        });
    }, 300);
};
onUpdated(() => {
    setTop();
    setHeight();
});
onMounted(() => {
    setTop();
    setHeight();
});
</script>
<style lang="scss" scoped></style>
