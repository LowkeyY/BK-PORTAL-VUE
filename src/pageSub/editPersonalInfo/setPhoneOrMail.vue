<template>
    <app-provider>
        <nav-bar :title="curtTitle" />
        <view class="container">
            <uni-list :border="false">
                <uni-list-item style="border-bottom: 2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">{{ type==='phone'?'新手机':'新邮箱' }}</text>
                        </view>
                    </template>
                    <template #body>
                        <uni-easyinput
                            v-model="receiveNumber" :input-border="false"
                            :placeholder="type==='phone'?'请输入新手机号码':'请输入新邮箱号码'"
                        ></uni-easyinput>
                    </template>
                </uni-list-item>
                <uni-list-item style="border-bottom: 2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">验证码</text>
                        </view>
                    </template>
                    <template #body>
                        <uni-easyinput v-model="curCode" :input-border="false"></uni-easyinput>
                    </template>
                    <template #footer>
                        <send-code-button type="default" :is-edit="true" :receive-number="receiveNumber" size="mini" :send-type="type" />
                    </template>
                </uni-list-item>
            </uni-list>
            <button class="button" :loading="loading" @click="handleEdit">完成</button>
        </view>
    </app-provider>
</template>

<script setup lang="ts">

import SendCodeButton from '@/components/sendCodeButton/sendCodeButton.vue';
import {getCurPageParam} from '@/utils';
import storage from '@/utils/storage';
import {StorageEnum} from '@/enums/storageEnum';
import {updatePhoneOrEmail} from '@/services/login';
import {handleJumpToPage} from '@/utils/handle';
import {Toast} from '@/utils/uniapi/prompt';

const {type} = getCurPageParam();
const curtTitle=ref(type==='phone'?'修改手机号码':'修改邮箱');
const receiveNumber=ref('');
const curCode=ref('');
const loading=ref(false);
const handleEdit =async () => {
    if(!receiveNumber.value){
        Toast(`请输入${type==='phone'?'手机号码':'邮箱'}`);
        return;
    }
    if(type==='phone'&&!(/^1[3456789]\d{9}$/.test(receiveNumber.value))){
        Toast('请输入正确的手机号码');
        return;
    }
    if(type==='email'&&!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(receiveNumber.value))){
        Toast('请输入正确的邮箱');
        return;
    }
    if(!curCode.value){
        Toast('请输入验证码');
        return;
    }
    loading.value=true;
    try {
        let curParams={
            'access_token': storage.get(StorageEnum.PORTAL_TOKEN),
            code:curCode.value,
        };
        curParams[type]=receiveNumber.value;
        const {code,message}=await updatePhoneOrEmail(curParams);
        if(code===0){
            handleJumpToPage('editPersonalInfo',);
        }else{
            Toast(message);
        }
    }finally {
        loading.value=false;
    }
};
</script>

<style scoped lang="scss">
.container {
  padding: 0 20rpx;
}
.slot-box {
  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: row;
  align-items: center;
  padding-right: 20rpx;
}
.slot-value {
  color: #00aaf0;
}
.button {
  background: linear-gradient(#fad25c, #f77b26);
  border: 0;
  color: #fff;
  width: 80%;
  margin-top: 60rpx;
}
</style>
