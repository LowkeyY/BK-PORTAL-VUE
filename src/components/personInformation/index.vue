<template>
    <view>
        <view class="header">
            <img
                :src="getImages(userInfo?.avatar, 'defaultUserIcon')"
                mode="aspectFill"
                style="width: 100%; height: 50%; filter: blur(2px)"
                @error="(el) => getErrorImg(el, 'user')"
            />
            <view class="header-bottom"></view>
            <view class="info-box">
                <img
                    :src="getImages(userInfo?.avatar, 'defaultUserIcon')"
                    mode="widthFix"
                    style="width: 200rpx; height: 200rpx; border-radius: 100rpx; border: 6rpx solid #fff"
                    @error="(el) => getErrorImg(el, 'user')"
                />
                <uni-title type="h3" :title="userInfo?.fullname"></uni-title>
                <button style="color: #fff; background: #2b83d7; border-radius: 8rpx; font-size: 24rpx" @click.stop="handleMessage">发消息</button>
            </view>
        </view>
        <uni-list>
            <uni-list-item style="background-color: #f6f6f6" :right-text="userInfo?.email" title="邮箱" />
        </uni-list>
        <view class="add-btn">
            <button style="color: #fff; background: #2b83d7; border-radius: 8rpx; font-size: 26rpx; padding: 10rpx 0" @click="addContact">添加联系人</button>
        </view>
        <uni-popup ref="alertDialog" type="dialog">
            <uni-popup-dialog type="info" cancel-text="取消" confirm-text="确定" content="确定添加联系人？" @confirm="dialogConfirm"> </uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script setup name="Nav">
import { getErrorImg, getImages } from '@/utils';
const router = useRouter();
const alertDialog = ref();
defineProps({
    userInfo: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(['handle-message', 'add-contact']);
const handleMessage = () => {
    emit('handle-message');
};
const addContact = () => {
    alertDialog.value?.open();
};
const dialogConfirm = () => {
    emit('add-contact');
};
</script>
<style lang="scss" scoped>
.header {
    height: 40vh;
    width: 100%;
    position: relative;
    .header-bottom {
        height: 50%;
        width: 100%;
        background-color: #fff;
    }
    .info-box {
        @include flex;

        flex-direction: column;
        height: 60%;
        width: 200rpx;
        position: absolute;
        left: 50%;
        top: 30%;
        translate: -50% 0;
        .avatar-box {
            width: 200rpx;
            height: 200rpx;
            border-radius: 100rpx;
            border: 2rpx solid #fff;
            background-color: pink;
            overflow: hidden;
            z-index: 10;
            .avatar {
                height: 100%;
                width: 100%;
            }
        }
    }
}
.add-btn {
    margin-top: 60rpx;
    padding: 40rpx 100rpx;
}
</style>
