<!--
 * @Author: Lowkey
 * @Date: 2024-05-17 11:45:04
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-23 14:23:28
 * @FilePath: \BK-Portal-VUE\src\components\FixedBtn\FixedBtn.vue
 * @Description: 
-->

<template>
    <view v-if="isBjouUser()" class="container" :style="{ top: top }" @click="handleCkick">
        <view class="content">
            <image class="icon" src="/static/images/spirit/feedback.svg" mode="scaleToFill" />
            <text>{{ text }}</text>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { isBjouUser } from '@/utils';
import { handleJumpToPage } from '@/utils/handle';

const props = defineProps({
    text: {
        type: String,
        default: '反馈',
    },
    top: {
        type: String,
        default: '120rpx',
    },
    suggestionParams: {
        type: Object,
        default: () => {},
    },
});

const handleCkick = () => {
    handleJumpToPage('SuggestionForm', props.suggestionParams);
};
</script>
<style lang="scss" scoped>
.container {
    position: fixed;
    right: 0;
    z-index: 99;
    .content {
        display: flex;
        align-items: center;
        background-color: #d1f2d7;
        color: #18bc37;
        font-size: $uni-font-size-lg;
        border-radius: 40px 0 0 40px;
        padding: 0 10rpx 0 0;
        .icon {
            width: 50rpx;
            height: 50rpx;
        }
    }
}
</style>
