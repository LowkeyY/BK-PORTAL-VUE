<template>
    <app-provider>
        <nav-bar :title="curtTitle" />
        <view class="container">
            <uni-list :border="false">
                <uni-list-item v-if="type==='phone'" style="border-bottom:2rpx solid #e5e5e5;">
                    <template #header>
                        <view class="slot-box">
                            <text class="slot-text">当前手机</text>
                        </view>
                    </template>
                    <template #body>
                        <text class="slot-value">{{ phone }}</text>
                        <!--                        <uni-easyinput v-model="phone" :input-border="false" disabled></uni-easyinput>-->
                    </template>
                </uni-list-item>
                <uni-list-item v-if="type==='email'" style="border-bottom:2rpx solid #e5e5e5;">
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
            </uni-list>
            <button class="next-button" :loading="loading" @click="handleNext">下一步</button>
        </view>
    </app-provider>
</template>

<script setup>
import {useResetStore} from '@/store/modules/reset';
import SendCodeButton from '@/components/sendCodeButton/sendCodeButton.vue';
import {getCurPageParam} from '@/utils';
import {verifyCode} from '@/services/reset';
import {handleJumpToPage} from '@/utils/handle';
import {Toast} from '@/utils/uniapi/prompt';

const {type} = getCurPageParam();
const useReset=useResetStore();
const curtTitle=ref(type==='phone'?'修改手机号':'修改邮箱');
const curCode=ref('');
const phone=ref('');
const email=ref('');
const loading=ref(false);

const handleNext =async () => {
    loading.value=true;
    try{
        const params={
            userId:useReset.userId,
            code:curCode.value
        };
        const {code,message}=await verifyCode(params);
        if(code===0){
            handleJumpToPage('setPhoneOrMail', {type});
        }else{
            Toast(message);
        }
    }finally {
        loading.value=false;
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
