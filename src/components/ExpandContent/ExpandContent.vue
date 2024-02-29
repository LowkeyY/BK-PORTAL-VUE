<!--
 * @Author: Lowkey
 * @Date: 2024-02-29 11:15:58
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-29 16:14:59
 * @FilePath: \BK-Portal-VUE\src\components\ExpandContent\ExpandContent.vue
 * @Description: 
-->

<template>
    <view ref="containerRef" class="container" :class="{hidden:showMask}" :style="{maxHeight:height}">
        <view ref="contentRef" class="content">
            <slot />
        </view>
        <view v-if="showMask" class="mask" :class="{position:!expand}">
            <view v-if="!expand" class="btn" @click="expand=true;height='100%'">{{ expandText }}</view>
            <view v-if="expand" @click="expand=false;height=maxHeight">收起</view>
        </view>
    </view>
</template>

<script lang="ts" setup name="ExpandContent">

const props = defineProps({
    expandText: {
        type: String,
        default: '展开'
    },
    maxHeight: {
        type: [Number,String],
        default: '80rpx'
    }
});
const containerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const showMask = ref(false);
const expand = ref(false);
const height = ref(props.maxHeight);

/**
 * @description: html 中如果包含 img,video等 异步加载时计算高度不对，需要onload后重新计算高度
 * @return {*}
 */
const calculateHeight = ():void => {
    const content =contentRef.value.$el;
    if(!contentRef.value.$el) return;
    const mediaElements = content.querySelectorAll('img, video, audio');
    const loadMediaPromises:Promise<unknown>[] = [];
    for (const mediaElement of mediaElements) {
        const loadMediaPromise = new Promise((resolve) => {
            mediaElement.onload = mediaElement.onloadedmetadata = resolve;
        });
        loadMediaPromises.push(loadMediaPromise);
    }

    Promise.all(loadMediaPromises).then(() => {
        const containerHei = containerRef.value.$el.offsetHeight;
        const contentHei = content.offsetHeight;
        if(contentHei>containerHei){
            showMask.value=true;
        }
    });
};

onMounted(()=>{
    nextTick(()=>{
        calculateHeight();
    });
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.mask {
  width: 100%;
  bottom: -2rpx;
  box-sizing: border-box;
  text-align: right;
  color: $uni-color-primary;
  .btn {
    flex: 1;
    background-image: linear-gradient(180deg, hsl(0deg 0% 100% / 60%), #fff);
  }
}
.hidden {
  overflow: hidden;
}
.position {
  position: absolute;
}
</style>
