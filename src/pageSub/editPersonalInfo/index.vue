<template>
    <app-provider>
        <nav-bar title="编辑个人信息" />
        <uni-list :border="false">
            <uni-list-item show-arrow clickable border style="border-bottom:2rpx solid #e5e5e5;">
                <template #header>
                    <view class="slot-box">
                        <image class="slot-image" src="@/static/svg/set/avatar.svg" />
                    </view>
                </template>
                <template #body>
                    <text class="slot-box slot-text">修改头像</text>
                </template>
                <template #footer>
                    <image class="avatar" :src="curHeadImg" mode="" @click="handleHeadImg"></image>
                </template>
            </uni-list-item>
            <uni-list-item show-arrow clickable style="border-bottom:2rpx solid #e5e5e5;" @click="handleJump('phone')">
                <template #header>
                    <view class="slot-box">
                        <image class="slot-image" src="@/static/svg/set/phonenumber.svg" />
                    </view>
                </template>
                <template #body>
                    <text class="slot-box slot-text">修改手机号</text>
                </template>
            </uni-list-item>
            <uni-list-item show-arrow clickable style="border-bottom:2rpx solid #e5e5e5;" @click="handleJump('email')">
                <template #header>
                    <view class="slot-box">
                        <image class="slot-image" src="@/static/svg/set/mailnumber.svg" />
                    </view>
                </template>
                <template #body>
                    <text class="slot-box slot-text">修改邮箱</text>
                </template>
            </uni-list-item>
            <uni-list-item show-arrow clickable style="border-bottom:2rpx solid #e5e5e5;" @click="handleJump('password')">
                <template #header>
                    <view class="slot-box">
                        <image class="slot-image" src="@/static/svg/set/password.svg" />
                    </view>
                </template>
                <template #body>
                    <text class="slot-box slot-text">修改密码</text>
                </template>
            </uni-list-item>
        </uni-list>
    </app-provider>
</template>

<script setup>

import {getBaseUrl} from '@/utils/env';
import storage from '@/utils/storage';
import {StorageEnum} from '@/enums/storageEnum';
import {getPortalAvatar} from '@/utils';
import {useUserStore} from '@/store/modules/user';
import {handleJumpToPage} from '@/utils/handle';


const useUser = useUserStore();
const {PORTAL_SERVER} =getBaseUrl();
const curFileUrl = `${PORTAL_SERVER}/file/downloadFile`;
const curHeadImg=ref();
const curUserInfo= ref(useUser.curUserInfo);
const ouchnUserInfo = ref(useUser.ouchnUserInfo);


const handleHeadImg = () => {
    const portalToken= storage.get(StorageEnum.PORTAL_TOKEN);
    uni.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (chooseImageRes) {
            const tempFilePaths = chooseImageRes.tempFilePaths;
            uni.uploadFile({
                url: `${PORTAL_SERVER}/file/upload`,
                filePath: tempFilePaths[0],
                formData: {
                    '__device': 'mobile',
                    'multipartFiles':chooseImageRes.tempFiles[0],

                },
                header: {
                    // 'content-type': 'multipart/form-data',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Credentials': true,
                    withCredentials:true,
                },
                success: (uploadFileRes) => {
                    console.log(uploadFileRes,'.data.data');
                }
            });

        }
    });
};


const handleJump = (type) => {
    console.log(type);
    if(type==='phone'||type==='email'){
        handleJumpToPage('editPhoneOrEmail', {type});
    }
    if(type==='password'){
        handleJumpToPage('editPassword', {type});
    }
};

onLoad(()=>{
    curHeadImg.value=getPortalAvatar(curFileUrl, curUserInfo?.headImg || ouchnUserInfo?.headImg);
});
</script>

<style scoped lang="scss">
.slot-box {
  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: row;
  align-items: center;
}
.slot-image {
  /* #ifndef APP-NVUE */
  display: block;

  /* #endif */
  margin-right: 40rpx;
  width: 50rpx;
  height: 50rpx;
}
.avatar{
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    width: 80rpx;
    height: 80rpx;
}
.slot-text {
  flex: 4;
  font-size: 32rpx;
}
::v-deep uni-list-item{
    background-color: pink;
}
</style>
