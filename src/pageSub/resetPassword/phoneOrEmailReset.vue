
<template>
    <app-provider>
        <nav-bar title="找回密码" />
        <view class="container">
            <image src="@/static/images/bgImages/loginBg.png" class="bg" />
            <view class="content">
                <uni-segmented-control
                    :current="current" :values="items" style-type="text"
                    active-color="#00aaf0" @clickItem="onClickItem"
                />
                <uni-forms v-if="current === 0" ref="phoneFormRef" :model-value="phoneForm">
                    <uni-forms-item name="email">
                        <template #default>
                            <uni-easyinput v-model="phoneForm.phone" prefix-icon="phone-filled" disabled class="input-container">
                            </uni-easyinput>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item name="code">
                        <template #default>
                            <view class="code">
                                <uni-easyinput v-model="phoneForm.code" prefix-icon="paperplane-filled" class="input-container">
                                </uni-easyinput>
                                <button v-if="!phoneDisabled" :loading="phoneLoading" type="primary" class="code-btn" plain="true" @click="handleSendCode">
                                    获取验证码
                                </button>
                                <button v-else class="timer-btn" :disabled="phoneDisabled">
                                    {{ `${phoneTimer}秒重新发送` }}
                                </button>
                            </view>
                        </template>
                    </uni-forms-item>
                </uni-forms>
                <uni-forms v-if="current === 1" ref="emailFormRef" :model-value="emailForm">
                    <uni-forms-item name="email">
                        <template #default>
                            <uni-easyinput v-model="emailForm.email" disabled prefix-icon="email-filled" class="input-container">
                            </uni-easyinput>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item name="code">
                        <template #default>
                            <view class="code">
                                <uni-easyinput v-model="emailForm.code" prefix-icon="paperplane-filled" class="input-container">
                                </uni-easyinput>
                                <button v-if="!emailDisabled" :loading="emailLoading" type="primary" class="code-btn" plain="true" @click="handleSendCode">
                                    获取验证码
                                </button>
                                <button v-else class="timer-btn" :disabled="emailDisabled">
                                    {{ `${emailTimer}秒重新发送` }}
                                </button>
                            </view>
                        </template>
                    </uni-forms-item>
                </uni-forms>
                <view class="btn-container">
                    <button type="default" class="next" @click="router.back()">上一步</button>
                    <button type="primary" :loading="loading" class="next" @click="handleNext">下一步</button>
                </view>
            </view>
        </view>
    </app-provider>
</template>

<script setup>

import {getCurPageParam} from '@/utils';
import {Toast} from '@/utils/uniapi/prompt';
import {handleJumpToPage} from '@/utils/handle';
import {resetSendCode, verifyCode} from '@/services/reset';

const router = useRouter();
const {userId,phone,email} = getCurPageParam();
const loading = ref(false);
const current = ref(0);
const items = ['手机找回','邮箱找回'];



const phoneFormRef = ref();
const phoneForm=ref({
    phone: phone,
    code: '',
});
const phoneDisabled=ref(false);
const phoneLoading=ref(false);
const phoneTimer=ref(60);
const emailFormRef = ref();
const emailForm=ref({
    email: email,
    code: '',
});
const emailLoading=ref(false);
const emailDisabled=ref(false);
const emailTimer=ref(60);

const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
};
const handleSendCode = () => {
    if(current.value===0){
        phoneLoading.value=true;
        const curParams={
            userId,
            receiveType:'phone'
        };
        resetSendCode(curParams).then((res)=>{
            phoneLoading.value=false;
            if(res.code===0){
                phoneDisabled.value = true;
                let timer1 = setInterval(() => {
                    phoneTimer.value--;
                    if (phoneTimer.value === 0) {
                        clearInterval(timer1);
                        phoneTimer.value = 60;
                        phoneDisabled.value = false;
                        return;
                    }
                }, 1000);
            }else{
                Toast('获取验证码失败');
            }
        });
    }
    if(current.value===1){
        emailLoading.value=true;
        const curParams={
            userId,
            receiveType:'email'
        };
        resetSendCode(curParams).then((res)=>{
            emailLoading.value=false;
            if(res.code===0){
                emailDisabled.value = true;
                let timer2 = setInterval(() => {
                    emailTimer.value--;
                    if (emailTimer.value === 0) {
                        clearInterval(timer2);
                        emailTimer.value = 60;
                        emailDisabled.value = false;
                        return;
                    }
                }, 1000);
            }else{
                Toast('获取验证码失败');
            }
        });
    }
};

const handleNext =async () => {
    const params={
        userId,
        code:current.value===0?phoneForm.value.code:emailForm.value.code
    };
    const {code}=await verifyCode(params);
    if(code===0){
        handleJumpToPage('setReset',params);
    }

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
    padding: 200rpx 80rpx 80rpx;
    .input-container {
      margin-top: 40rpx;
      height: 90rpx;
    }
    .code {
      height: 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40rpx;
      .code-btn {
        margin-left: 20rpx;
        height: 82rpx;
        margin-top: 40rpx;
        line-height: 82rpx;
        width: 35%;
        font-size: 24rpx;
      }
      .timer-btn {
        margin-left: 20rpx;
        height: 86rpx;
        margin-top: 40rpx;
        line-height: 86rpx;
        width: 35%;
        font-size: 24rpx;
        background-color: #ddd;
        color: #fff;
      }
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

