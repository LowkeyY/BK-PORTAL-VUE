<template>
    <view>
        <uni-list v-for="(item, index) in settings" :key="item.id" :index="index">
            <uni-list-item :show-extra-icon="true" :extra-icon="item.extraIcon" :title="item.text" :right-text="item.value" :show-arrow="item.showArrow" />
        </uni-list>
        <view class="btn-box">
            <button type="primary" class="btn" @click="showExitAlert">退出</button>
        </view>
        <!--        退出提示框-->
        <uni-popup ref="alertDialog" type="dialog">
            <uni-popup-dialog
                type="info"
                cancel-text="立即退出"
                confirm-text="暂不"
                title="退出"
                content="你确定要退出学习状态吗？"
                @close="dialogExit"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import { router } from '@/router';

const alertDialog = ref();
const authStore = useAuthStore();
const settings = [
    {
        id: '1',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'trash',
        },
        text: '清理缓存',
        value: '0B',
    },
    {
        id: '2',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'info',
        },
        text: '版本信息',
        value: '6.0.0.104',
    },
    {
        id: '3',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'paperplane',
        },
        text: '意见反馈',
        showArrow: true,
    },
    {
        id: '4',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'help',
        },
        text: '使用帮助',
        showArrow: true,
    },
];

const showExitAlert = () => {
    alertDialog.value?.open();
};
const dialogExit = () => {
    console.log('tuichu');
    authStore.loginOut().then(() => {
        router.push({ name: 'Login' });
    });
};
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 40rpx 80rpx;
    .btn {
        background: linear-gradient(#fad25c, #f77b26);
        border: 0;
    }
}
</style>
