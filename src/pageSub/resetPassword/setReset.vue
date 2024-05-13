
<template>
    <app-provider>
        <nav-bar title="找回密码" />
        <view class="container">
            <image src="@/static/images/bgImages/loginBg.png" class="bg" />
            <view class="content">
                <uni-title type="h4" align="left" style="padding-bottom: 40rpx;" title="重置密码"></uni-title>
                <uni-forms ref="passwordFormRef" :model-value="passwordForm" :rules="rules">
                    <uni-forms-item name="password">
                        <template #default>
                            <uni-easyinput v-model="passwordForm.password" type="password" prefix-icon="locked-filled" placeholder="请输入新密码" class="input-container">
                            </uni-easyinput>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item name="newPassword">
                        <template #default>
                            <view>
                                <uni-easyinput v-model="passwordForm.newPassword" type="password" prefix-icon="locked-filled" placeholder="请再次输入新密码" class="input-container">
                                </uni-easyinput>
                            </view>
                        </template>
                    </uni-forms-item>
                </uni-forms>
                <view class="btn-container">
                    <button type="default" class="next" @click="router.back()">上一步</button>
                    <button type="primary" class="next" @click="handleSubmit">完成</button>
                </view>
            </view>
        </view>
    </app-provider>
</template>

<script setup>
import {getCurPageParam} from '@/utils';
import { validRule} from '@/services/login';
import {Toast} from '@/utils/uniapi/prompt';
import CryptoJS from 'crypto-js';
import {resetPassword} from '@/services/reset';
import {handleJumpToPage} from '@/utils/handle';
import {router} from '@/router';


const {userId,code} = getCurPageParam();
const passwordFormRef=ref();
const passwordForm=ref({
    password: '',
    newPassword: '',
});

const rules = {
    password: {
        rules: [
            { required: true, errorMessage: '请输入密码' },
            { minLength: 6, maxLength: 18, errorMessage: '密码在 {minLength} 到 {maxLength} 个字符' },
        ],
    },
    newPassword: {
        rules: [
            { required: true, errorMessage: '请再次输入新密码' },
            {
                validateFunction:function(rule, value, data, callback) {
                    if (value !== passwordForm.value.password) {
                        callback('两次输入的密码不一致');
                    }
                    return true;
                },
            }

        ],
    }
};

const encryptSHA1 = (word) => {
    return CryptoJS.SHA1(word).toString();
};
const setPassword =async () => {
    const {code:successCode,message}=await validRule({characters:passwordForm.value.password});
    if(successCode===0){
        const curParams={
            userId,
            code,
            password:encryptSHA1(passwordForm.value.password),
        };
        const {code:resetCode,message}=await resetPassword(curParams);
        if(resetCode===0){
            handleJumpToPage('setSuccess');
        }else{
            Toast(message,{icon:'error'});
        }
    }else{
        Toast(message);
    }

};
const handleSubmit = () => {
    passwordFormRef.value.validate().then(() => {
        setPassword();

    });
};
</script>
<style lang="scss" scoped>
::v-deep .uni-easyinput__content {
  height: 100%;
}
::v-deep .container .content {
  text-align: left;
}
.flex {
  display: flex;
}
.container {
  margin: 0 auto;
  background-size: cover;
  height: 100%;
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
    padding: 100rpx;
    .input-container {
      height: 80rpx;
    }
    .btn-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      .next {
        width: 40%;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        margin: 0;
      }
    }
  }
}
</style>
