
<template>
    <app-provider>
        <nav-bar title="绑定手机" />
        <view class="container">
            <image src="@/static/images/bgImages/loginBg.png" class="bg" />
            <view class="content">
                <uni-forms ref="phoneFormRef" :model-value="phoneForm" :rules="rules">
                    <uni-forms-item name="email">
                        <template #default>
                            <uni-easyinput v-model="phoneForm.phone" prefix-icon="phone-filled" class="input-container">
                            </uni-easyinput>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item name="code">
                        <template #default>
                            <view class="code">
                                <uni-easyinput v-model="phoneForm.code" prefix-icon="paperplane-filled" class="input-container">
                                </uni-easyinput>
                                <button v-if="!disabled" type="primary" class="code-btn" plain="true" @click="handleSendCode">
                                    获取验证码
                                </button>
                                <button v-else class="timer-btn" :disabled="disabled">
                                    {{ `${timer}秒重新发送` }}
                                </button>
                            </view>
                        </template>
                    </uni-forms-item>
                </uni-forms>
                <button type="primary" class="next" @click="handleSubmit">绑定</button>
            </view>
        </view>
    </app-provider>
</template>

<script setup>

import {getCurPageParam} from '@/utils';
import storage from '@/utils/storage';
import {StorageEnum} from '@/enums/storageEnum';
import {sendCode, updatePhoneOrEmail} from '@/services/login';
import {Toast} from '@/utils/uniapi/prompt';
import {handleJumpToPage} from '@/utils/handle';

const router = useRouter();
const {userId} = getCurPageParam();
const phoneFormRef = ref();
const phoneForm=ref({
    phone: '',
    code: '',
});
const disabled=ref(false);
const timer=ref(60);
const rules = {
    phone: {
        rules: [
            { required: true, errorMessage: '请输入手机号' },
            {
                pattern:'^1[3456789]\\d{9}$',
                errorMessage: '请输入正确的手机号'
            }
        ],
    }
};

const handleSendCode = () => {
    phoneFormRef.value.validate().then(() => {
        const curParams={
            'access_token':storage.get(StorageEnum.PORTAL_TOKEN),
            userId,
            phone:phoneForm.value.phone
        };
        sendCode(curParams).then((res)=>{
            if(res.code===0){
                disabled.value = true;
                let timer1 = setInterval(() => {
                    timer.value--;
                    if (timer.value === 0) {
                        clearInterval(timer1);
                        timer.value = 60;
                        disabled.value = false;
                        return;
                    }
                }, 1000);
            }else{
                Toast('获取验证码失败');
            }
        });
    });
};

const handleSubmit =async () => {
    if(!phoneForm.value.code){
        Toast('请输入验证码',{icon:'error'},);
        return;
    }
    const curParams={
        'access_token':storage.get(StorageEnum.PORTAL_TOKEN),
        ...phoneForm.value
    };
    const {code}=await updatePhoneOrEmail(curParams);
    if(code===0){
        handleJumpToPage('firstLogin', {userId});
    }else{
        Toast('绑定失败',{icon:'error'},);
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
    padding: 80rpx;
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
    .next {
      color: #fff;
      background-color: #00aaf0;
      border-color: #00aaf0;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 30rpx;
    }
  }
}
</style>

