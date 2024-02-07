<!--
 * @Author: Lowkey
 * @Date: 2024-02-07 14:00:41
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-07 15:10:13
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\StatusIcon.vue
 * @Description: 
-->
<template>
    <view>
        <view v-if="tracking===ResourceTracking.MANUAL">
            <image class="img" :src="getIcon(state,tracking)" mode="widthFix" />
        </view>
        <view v-if="tracking===ResourceTracking.AUTO">
            <image class="img" :src="getIcon(state,tracking)" mode="widthFix" />
        </view>
    </view>
</template>

<script setup name="ResourceList">
import {ResourceTracking} from '@/enums/statusEnum';
defineProps({
    id: {
        type: [Number,String],
        default: 7527
    },
    state: {
        type: String,
        default: '1'
    },
    tracking: {
        type: String,
        default: '1'
    },
});
const getIcon = (state, tracking) => {
    const PATH = '/static/svg/resourceStatus';
    const newState = parseInt(state, 10);
    if (tracking === '2') {
        if (newState === 1) {
            return `${PATH}/completion-auto-pass.svg`;
        } else if (newState === 2) {
            return `${PATH}/completion-auto-pass.svg`;
        } else if (newState === 3) {
            return `${PATH}/completion-auto-fail.svg`;
        }
        return `${PATH}/completion-auto-n.svg`;
    } else {
        if (newState === 1) {
            return `${PATH}/completion-manual-y.svg`;
        } else if (newState === 2) {
            return `${PATH}/completion-manual-y.svg`;
        } else if (newState === 3) {
            return `${PATH}/completion-auto-fail.svg`;
        }
        return `${PATH}/completion-manual-n.svg`;
    }
};
</script>

<style scoped lang="scss">
  .img {
    width: 40rpx;
  }
</style>