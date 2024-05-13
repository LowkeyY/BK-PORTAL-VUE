<template>
    <view>
        <view class="code">
            <button
                v-if="!curDisabled" :loading="loading" :type="type" :plain="plain" :size="size"
                @click.stop="handleSendCode"
            >
                获取验证码
            </button>
            <button v-else class="timer-btn" :disabled="curDisabled" :size="size">
                {{ `${curTimer}秒重新发送` }}
            </button>
        </view>
        <data-picker ref="dataPickerRef" :localdata="items" popup-title="请选择验证方式" @change="handleChange" @popupclosed="handleClose" />
    </view>
</template>

<script setup lang="ts" name="SendCode">
import {resetSendCode} from '@/services/reset';
import {Toast} from '@/utils/uniapi/prompt';
import {useResetStore} from '@/store/modules/reset';
import storage from '@/utils/storage';
import {StorageEnum} from '@/enums/storageEnum';
import {sendCode} from '@/services/login';
import DataPicker from '@/components/data-picker/data-picker';
import {getCurPageParam} from '@/utils';


const props = defineProps({
    disabled:{
        type: Boolean,
        default: false
    },
    size:{
        type:String,
        default:'default'
    },
    type:{
        type:String,
        default:'primary'
    },
    timer:{
        type:Number,
        default:60
    },
    plain:{
        type: Boolean,
        default: true
    },
    sendType:{
        type: String,
        default: 'phone'
    },
    isEdit:{
        type: Boolean,
        default: false
    },
    receiveNumber:{
        type: String,
        default: ''
    }
});

const {type} = getCurPageParam();
const useReset=useResetStore();
const dataPickerRef=ref();
const curTimer=ref(props.timer);
const curDisabled=ref(props.disabled);
const loading=ref(false);
const  items=[
    {text: '短信验证码', value: 'phone'},
    {text: '邮箱验证码', value: 'email'}
];
const curSendType=ref(props.sendType);

const sendTypeCode=async (curType) => {
    if(props.isEdit&&!props.receiveNumber){
        Toast(curType==='phone'?'请输入手机号':'请输入邮箱');
        return;
    }
    loading.value=true;
    const curParams={
        userId:useReset.userId,
        receiveType:curType
    };
    let editParams={
        'access_token':storage.get(StorageEnum.PORTAL_TOKEN),
        userId:useReset.userId,
    };
    editParams[curType]=props.receiveNumber;
    try{
        const {code}=props.isEdit?await sendCode(editParams):await resetSendCode(curParams);
        if(code===0){
            curDisabled.value=true;
            let timer1 = setInterval(() => {
                curTimer.value--;
                if (curTimer.value === 0) {
                    clearInterval(timer1);
                    curTimer.value = 60;
                    curDisabled.value = false;
                    return;
                }
            }, 1000);
        }else{
            Toast('获取验证码失败');
        }
    }finally {
        loading.value=false;
    }
};
const handleSendCode =async () => {
    if(props.sendType==='phone'||props.sendType==='email'){
        sendTypeCode(props.sendType);
    }
    if(props.sendType==='password'){
        dataPickerRef.value.handleInput();
    }
};
const handleChange=(e)=> {
    curSendType.value=e.detail.value[0].value;
    sendTypeCode(curSendType.value);
};
</script>


