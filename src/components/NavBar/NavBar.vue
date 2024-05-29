<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-29 19:21:43
 * @FilePath: \BK-Portal-VUE\src\components\NavBar\NavBar.vue
 * @Description: 
-->
<template>
    <view class="contaner" :style="{ height: `${88 + px2rpx(useSystem().statusBarHeight || 0)}rpx` }">
        <view class="nav-status">
            <status-bar />
        </view>
        <uni-nav-bar
            class="nav-bar"
            :style="{ top: height }"
            :dark="dark"
            color="#fff"
            background-color="#2b83d7"
            :border="false"
            :shadow="shadow"
            :title="title"
            left-icon="left"
            :right-text="rightText"
            @click-left="handleLeftClick"
            @click-right="handleRightClick"
        >
            <template #left>
                <slot name="left"></slot>
            </template>
            <template #right>
                <slot name="right"></slot>
            </template>
        </uni-nav-bar>
        <uni-popup ref="alertDialogRef" type="dialog">
            <uni-popup-dialog
                type="warn"
                cancel-text="取消"
                confirm-text="确定"
                title="返回？"
                :content="modalContent"
                @confirm="dialogConfirm"
                @close="dialogClose"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script setup name="Nav">
import { useSystem } from '@/hooks/app/useSystem';
import { px2rpx } from '@/utils/uniapi';
const height = `${px2rpx(useSystem().statusBarHeight || 0)}rpx`;
const router = useRouter();
const props = defineProps({
    dark: {
        type: Boolean,
        default: false,
    },
    shadow: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '(●◡●)',
    },
    rightText: {
        type: String,
        default: '',
    },
    showModal: {
        type: Boolean,
        default: false,
    },
    modalContent: {
        type: String,
        default: '返回后不会保存当前操作!',
    },
    useLeftClick: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['handle-right-click', 'handle-left-click']);
const alertDialogRef = ref(null);
const handleLeftClick = () => {
    if (props.useLeftClick) {
        emit('handle-left-click');
        return;
    }
    if (props.showModal) {
        alertDialogRef.value.open();
        return;
    }
    router.back();
};
const handleRightClick = () => {
    emit('handle-right-click');
};
const dialogConfirm = () => {
    router.back();
};
const dialogClose = () => {
    alertDialogRef.value.close();
};
</script>

<style lang="scss" scoped>
.contaner {
    width: 100%;
    //   height: 88rpx;
    .nav-status {
        width: 100%;
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
    }
    .nav-bar {
        width: 100%;
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
    }
}
</style>
