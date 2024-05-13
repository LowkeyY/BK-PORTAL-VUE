
<template>
    <app-provider>
        <nav-bar title="初次登录" />
        <view class="container">
            <image src="@/static/images/bgImages/loginBg.png" class="bg" />
            <view class="content">
                <uni-title type="h4" align="left" title="初次登录系统，需要确认手机和邮箱，并修改初始密码。"></uni-title>
                <uni-easyinput v-model="phone.receiveNumber" disabled prefix-icon="phone-filled" class="input-container">
                    <template #right>
                        <text class="action-btn" @click="handleReset('phone')">{{ email?.receiveNumber?'修改':'绑定' }}</text>
                    </template>
                </uni-easyinput>
                <uni-easyinput v-model="email.receiveNumber" disabled prefix-icon="email" class="input-container">
                    <template #right>
                        <text class="action-btn" @click="handleReset('email')">{{ email?.receiveNumber?'修改':'绑定' }}</text>
                    </template>
                </uni-easyinput>
                <button type="primary" class="next" @click="handleNext">下一步</button>
            </view>
        </view>
    </app-provider>
</template>

<script setup>

import {getResetTypes} from '@/services/login';
import {getCurPageParam} from '@/utils';
import {Toast} from '@/utils/uniapi/prompt';
import {handleJumpToPage} from '@/utils/handle';

const router = useRouter();
const {userId} = getCurPageParam();
const phone=ref({});
const email=ref({});

const handleReset = (type) => {
    if (type === 'phone') {
        handleJumpToPage('phoneReset', {userId});
    } else if (type === 'email') {
        handleJumpToPage('mailReset', {userId});
    }

};

const handleNext = () => {
    if (phone.value.receiveNumber && email.value.receiveNumber) {
        handleJumpToPage('setPassword', {userId});
    } else {
        Toast('请绑定手机号和邮箱',{icon:'error'});
    }
};

onLoad(async ()=>{
    const {code,data}=await getResetTypes({userId});
    if(code===0){
        if (Array.isArray(data) && data.length === 2) {
            phone.value=data.find(item=>item.receiveType==='phone');
            email.value=data.find(item=>item.receiveType==='email');
            console.log(phone.value,'----',email.value);
        }else if (Array.isArray(data) && data.length === 1) {
            phone.value=data.find(item=>item.receiveType==='phone');
            email.value=data.find(item=>item.receiveType==='email');
        } else if (Array.isArray(data) && data.length === 0) {
            Toast.fail('该账号未绑定手机或邮箱');
        }
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
    .action-btn {
      font-size: 24rpx;
      color: #2b83d7;
      padding-right: 10rpx;
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
