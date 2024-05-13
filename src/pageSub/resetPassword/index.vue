
<template>
    <app-provider>
        <nav-bar title="找回密码" />
        <view class="container">
            <image src="@/static/images/bgImages/loginBg.png" class="bg" />
            <view class="content">
                <uni-title type="h4" align="left" title="账号输入"></uni-title>
                <uni-easyinput v-model="accountName" prefix-icon="person-filled" class="input-container">
                </uni-easyinput>
                <view class="btn-container">
                    <button type="default" class="next" @click="router.back()">返回</button>
                    <button type="primary" :loading="loading" :disabled="disabled" class="next" @click="handleNext">下一步</button>
                </view>
            </view>
        </view>
    </app-provider>
</template>

<script setup>

import {getResetTypes} from '@/services/login';
import {Toast} from '@/utils/uniapi/prompt';
import {handleJumpToPage} from '@/utils/handle';
import {watch} from 'vue';
import {getUserByAccountName} from '@/services/reset';
import {isArray} from '@/utils/is';

const router = useRouter();
const accountName=ref('');
const loading=ref(false);
const disabled=ref(true);

const handleNext =async () => {
    loading.value=true;
    try {
        const {code,data:userId}=await getUserByAccountName({accountName:accountName.value});
        if(code===0){
            const {code,data:info,message}=await getResetTypes({userId});
            if(code===0){
                if(isArray(info)){
                    let params={};
                    info.forEach(item=>{
                        params[item.receiveType]=item.receiveNumber;
                    });
                    handleJumpToPage('phoneOrEmailReset',{userId,...params})
                }
            }else{
                Toast(message,{icon:'error'});
            }
        }else{
            Toast('账号不正确');
        }
    }finally {
        loading.value=false;
    }
};

watch(() => accountName.value, () => {
    if(accountName.value){
        disabled.value=false;
    }else{
        disabled.value=false;
    }
});
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
      margin: 30rpx 0;
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
