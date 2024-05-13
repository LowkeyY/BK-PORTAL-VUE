<!-- eslint-disable vue/no-parsing-error -->

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
    <view class="container">
        <image src="@/static/images/bgImages/loginBg.png" class="bg" />
        <view class="content">
            <image class="logo" src="@/static/images/logos/loginLogo.png" mode="widthFix" />
            <view class="form-wrap">
                <uni-forms ref="loginFormRef" :model-value="loginForm" :rules="rules">
                    <uni-forms-item name="username">
                        <template #default>
                            <view class="form-item">
                                <view class="icon">
                                    <image style="width: 22px; height: 22px;" src="@/static/images/spirit/user.png" />
                                </view>
                                <uni-easyinput
                                    v-model="loginForm.username"
                                    :input-border="false"
                                    class="account-input"
                                    trim="all"
                                    type="text"
                                    placeholder="请输入用户名"
                                />
                            </view>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item name="password">
                        <template #default>
                            <view class="form-item">
                                <view class="icon">
                                    <image style="width: 22px; height: 22px;" src="@/static/images/spirit/lock.png" />
                                </view>
                                <uni-easyinput v-model="loginForm.password" :input-border="false" trim="all" type="password" placeholder="请输入密码" />
                            </view>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item v-show="useStore.isShowCode" name="captchaCode">
                        <template #default>
                            <view class="form-item radius">
                                <uni-easyinput v-model="loginForm.captchaCode" :input-border="true" trim="all" type="text" placeholder="验证码" />
                                <img
                                    style="width: 40%; height: 100%;margin-left: 10rpx;" :src="useStore.captchaImg" alt=""
                                    @click="handleGetCaptchaImg"
                                />
                            </view>
                        </template>
                    </uni-forms-item>
                </uni-forms>
            </view>
            <view class="extra-content">
                <a @click="handleLoginInfo">登录提示</a>
                <a @click="handleSetPassword">忘记密码？</a>
            </view>
            <button :loading="useStore.loadingState" type="primary" @click="submit">登录</button>
            <view>
                <select-roles ref="selectRolesRef" @select-role="handleLoginByRole" />
            </view>
        </view>
        <uni-popup ref="infoPopupRef" type="center" background-color="#fff">
            <slot name="default">
                <view class="infoMsg">
                    <rich-text style="color: #888;font-size: 24rpx;text-align: left;" :nodes="loginInfoMsg"></rich-text>
                    <view class="infoMsgConfirm" @click="handleInfoConfirm">确认</view>
                </view>
            </slot>
        </uni-popup>
    </view>
</template>

<script setup>

import { useAuthStore } from '@/store/modules/auth';
import { useUserStore } from '@/store/modules/user';
import {getErrorImg, setStorage} from '@/utils';
import { StorageEnum } from '@/enums/storageEnum';
import storage from '@/utils/storage';
import {loginInfo} from '@/services/login';
import {handleJumpToPage} from '@/utils/handle';

const loginFormRef = ref();
const infoPopupRef = ref();
const selectRolesRef = ref();
const useStore = useAuthStore();
const useUser = useUserStore();
const loginInfoMsg = ref('');
const captchaImg = ref();
const loginForm = ref({
    username: storage.get('account'),
    password: '',
});
watch(() => useUser.roleList, newValue => {
    if(newValue.length>1){
        selectRolesRef.value.toggle();
    }
});
const rules = {
    username: {
        rules: [
            {
                required: true,
                errorMessage: '请输入姓名',
            },
        ],
    },
    password: {
        rules: [
            { required: true, errorMessage: '请输入密码' },
            { minLength: 6, maxLength: 18, errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符' },
        ],
    },
};
const router = useRouter();

const submit = () => {

    loginFormRef.value.validate().then(() => {

        useStore
            .singleSignOn(loginForm.value)
            .then((res) => {
                if (res) {
                    router.replaceAll({
                        name: 'Home',
                    });
                }
            })
            .catch(() => { console.log(2);});
    });
};
const handleLoginByRole = (role) =>{
    useUser.orgCode=role;
    setStorage({[StorageEnum.ORG_CODE]:role});
    useStore.checkFirstLogin();
};

const handleLoginInfo =async () => {
    const {success,data}=await loginInfo();
    if(success){
        loginInfoMsg.value=data;
    }
    infoPopupRef.value.open();
};

const handleSetPassword = () => {
    handleJumpToPage('resetPassword');
};
const handleInfoConfirm = () => {
    infoPopupRef.value.close();
};
const handleGetCaptchaImg = () => {
    useStore.handleCaptchaImg(loginForm.value.username);
};

</script>
<style lang="scss" scoped>
::v-deep .uni-easyinput__content {
  height: 100%;
}
::v-deep .uni-popup .uni-popup__wrapper {
  width: 600rpx;
  border-radius: 10rpx;
  padding: 40rpx 20rpx 20rpx;
}
::v-deep .container .content {
  text-align: left;
}
.infoMsgConfirm {
  margin-top: 40rpx;
  border-top: 2rpx solid #e0e0e0;
  padding-top: 20rpx;
  color: #2b83d7;
}
.container {
  margin: 0 auto;
  background-size: cover;
  height: 100vh;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .content {
    position: absolute;
    width: 100%;
    z-index: 2;
    text-align: center;
    padding: 0 80rpx;
    .logo {
      margin-top: 100rpx;
      width: 360rpx;
    }
    .form-wrap {
      margin-top: 80rpx;
      .form-item {
        display: flex;
        height: 44px;
        .radius {
          border-radius: 8px 0 0 8px;
        }
        .icon {
          width: 44px;
          height: 44px;
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px 0 0 8px;
        }
      }
    }
    .extra-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      margin-bottom: 22px;
    }
  }
}
</style>
