<!--
 * @Author: Lowkey
 * @Date: 2024-02-29 11:15:58
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-07 13:43:44
 * @FilePath: \BK-Portal-VUE\src\components\ExpandContent\ExpandContent.vue
 * @Description: 
-->

<template>
    <view ref="containerRef" class="container" :class="{ hidden: showMask }" :style="{ maxHeight: height }">
        <view ref="contentRef" class="content">
            <slot />
        </view>
        <view v-if="showMask" class="mask" :class="{ position: !expand }">
            <view
                v-if="!expand"
                class="btn"
                @click="
                    expand = true;
                    height = '100%';
                "
            >
                <text> {{ expandText }}</text>
                <uni-icons type="arrow-down" color="#2b83d7" size="18" />
            </view>
            <view
                v-if="expand"
                class="btn"
                @click="
                    expand = false;
                    height = maxHeight;
                "
            >
                <text>收起</text>
                <uni-icons type="arrow-up" color="#2b83d7" size="18" />
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup name="ExpandContent">
const _this = getCurrentInstance();
const props = defineProps({
    expandText: {
        type: String,
        default: '展开',
    },
    maxHeight: {
        type: [Number, String],
        default: '80rpx',
    },
});
const containerRef = ref<HTMLElement | any>(null);
const contentRef = ref<HTMLElement | any>(null);
const showMask = ref(true);
const expand = ref(false);
const height = ref(props.maxHeight);

/**
 * @description: html 中如果包含 img,video等 异步加载时计算高度不对，需要onload后重新计算高度
 * @return {*}
 */
const calculateHeight = (): void => {
    // 暂时不兼容app
    if (!contentRef.value) return;
    const content = contentRef.value?.$el;
    const mediaElements = content.querySelectorAll('img, video, audio');
    const selectQuery = uni.createSelectorQuery().in(_this);
    const mediaElement = selectQuery.select('img');
    const loadMediaPromises: Promise<unknown>[] = [];
    const contentDom = selectQuery.select('.content');
    const containerDom = selectQuery.select('.container');
    for (const mediaElement of mediaElements) {
        const loadMediaPromise = new Promise((resolve) => {
            mediaElement.onload = mediaElement.onloadedmetadata = resolve;
        });
        loadMediaPromises.push(loadMediaPromise);
    }

    Promise.all(loadMediaPromises).then(() => {
        const containerHei = containerRef.value?.$el.offsetHeight;
        const contentHei = content.offsetHeight;
        console.log(contentHei);
        if (contentHei > containerHei) {
            showMask.value = true;
        }
    });
};

onUpdated(() => {
    nextTick(() => {
        // calculateHeight();
    });
});
onMounted(() => {
    nextTick(() => {
        // calculateHeight();
    });
});
</script>

<style lang="scss" scoped>
.container {
    position: relative;
}
.mask {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 20rpx;
    bottom: -2rpx;
    box-sizing: border-box;
    color: $uni-color-primary;
    background-image: linear-gradient(180deg, hsl(0deg 0% 100% / 60%), #fff);
    .btn {
        display: flex;
        align-items: center;
    }
}
.hidden {
    overflow: hidden;
}
.position {
    position: absolute;
}
</style>
