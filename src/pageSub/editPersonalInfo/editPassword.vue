<template>
    <app-provider>
        <nav-bar :title="curtTitle" />
        <view class="container">
            <uni-list :border="false">
                <uni-list-item style="border-bottom:2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">当前手机</text>
                        </view>
                    </template>
                    <template #body>
                        <text class="slot-value">{{ phone }}</text>
                    </template>
                </uni-list-item>
                <uni-list-item style="border-bottom:2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">当前邮箱</text>
                        </view>
                    </template>
                    <template #body>
                        <text class="slot-value">{{ email }}</text>
                        <!--                        <uni-easyinput v-model="email" :input-border="false" disabled></uni-easyinput>-->
                    </template>
                </uni-list-item>
                <uni-list-item style="border-bottom:2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">验证码</text>
                        </view>
                    </template>
                    <template #body>
                        <uni-easyinput v-model="curCode" :input-border="false"></uni-easyinput>
                    </template>
                    <template #footer>
                        <send-code-button type="default" size="mini" :send-type="type" />
                    </template>
                </uni-list-item>
                <uni-list-item style="border-bottom:2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">新密码</text>
                        </view>
                    </template>
                    <template #body>
                        <uni-easyinput v-model="password" :input-border="false"></uni-easyinput>
                    </template>
                </uni-list-item>
                <uni-list-item style="border-bottom:2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">确认密码</text>
                        </view>
                    </template>
                    <template #body>
                        <uni-easyinput v-model="newPassword" :input-border="false"></uni-easyinput>
                    </template>
                </uni-list-item>
            </uni-list>
            <button class="next-button" :loading="loading" @click="handleSubmit">完成</button>
        </view>
    </app-provider>
</template>

<script setup>
import {useResetStore} from '@/store/modules/reset';
import SendCodeButton from '@/components/sendCodeButton/sendCodeButton.vue';
import {getCurPageParam} from '@/utils';
import {resetPassword, verifyCode} from '@/services/reset';
import {handleJumpToPage} from '@/utils/handle';
import {Toast} from '@/utils/uniapi/prompt';
import {validRule} from '@/services/login';
import CryptoJS from 'crypto-js';

const {type} = getCurPageParam();
const useReset=useResetStore();
const curtTitle=ref(type==='phone'?'修改手机号':'修改邮箱');
const curCode=ref('');
const phone=ref('');
const password=ref();
const newPassword=ref();
const email=ref('');
const loading=ref(false);

const handleSubmit =async () => {
    if(!curCode.value){
        Toast('请输入验证码','error');
        return;
    }
    if(!password.value){
        Toast('请输入密码','error');
        return;
    }
    if (password.value !== newPassword.value) {
        Toast('两次输入的密码不一致');
        return;
    }
    const {code:validCode,message}=await validRule({characters:password.value});
    if(validCode===0){
        const curParams={
            userId:useReset.userId,
            code:curCode.value,
            confirm:newPassword.value,
            password:CryptoJS.SHA1(password.value).toString(),
        };
        const {code:resetCode,message}=await resetPassword(curParams);
        if(resetCode===0){
            handleJumpToPage('editPersonalInfo');
        }else{
            Toast(message,{icon:'error'});
        }
    }else{
        Toast(message);
    }

};

onMounted(async ()=>{
    await useReset.queryPhoneAndEmail();
    if (Array.isArray(useReset.resetTypes)) {
        phone.value=useReset.resetTypes.find(item=>item.receiveType==='phone')?.receiveNumber;
        email.value=useReset.resetTypes.find(item=>item.receiveType==='email')?.receiveNumber;
    }
});
</script>

<style scoped lang="scss">
.container{
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
.slot-value{
    color: #bbb;
}
.next-button{
    background: linear-gradient(#FAD25C, #F77B26);
    border: 0;
    color: #ffffff;
    width: 80%;
    margin-top: 60rpx;
}
</style>
