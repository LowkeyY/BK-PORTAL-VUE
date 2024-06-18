<!-- eslint-disable camelcase -->
<!--
 * @Author: Lowkey
 * @Date: 2024-06-05 11:05:17
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 13:11:05
 * @FilePath: \BK-Portal-VUE\src\components\RecorderBox\RecorderBox.vue
 * @Description: 
-->

<template>
    <view class="content">
        <view class="top-bar">
            <view class="title">音频录制</view>
            <uni-icons type="closeempty" size="50rpx" color="#555" @click="handlerClose"></uni-icons>
        </view>
        <view>
            <audio-player
                v-if="recordState==='complete'"
                :active-index="-1"
                :audio-src="audioSrc"
                :show-audio-speed-icon="false"
                :autoplay="false"
            />
        </view>
        <view v-if="recordState!=='complete'" class="control-bar">
            <view class="time">{{ `${countUpData.m}:${countUpData.s}` }}</view>
            <view v-if="recordState!=='recording'" class="record-btn" @click="recStart">
                <uni-icons type="mic-filled" size="60rpx" color="#409eff"></uni-icons>
            </view>
            <view class="stop-btn" @click="recStop">
                <uni-icons type="checkmarkempty" size="60rpx" color="#409eff"></uni-icons>
            </view>
        </view>
        <view v-else class="control-bar">
            <uni-icons type="trash-filled" size="60rpx" color="#e43d33" @click="handlerDeleteAudio"></uni-icons>
            <button type="primary" size="mini" @click="submitRecord">提交</button>
        </view>
        <uni-popup ref="alertDialogRef" type="dialog">
            <uni-popup-dialog
                type="warn"
                cancel-text="关闭"
                confirm-text="确定"
                title="无法获取录音权限"
                content="获取录音权限失败，无法录制音频文件"
                @confirm="dialogConfirm"
                @close="dialogClose"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>
    

<script setup name="RecorderBox">
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer.vue';
import { Toast } from '@/utils/uniapi/prompt';

const emits = defineEmits(['close','save-record']);
// #ifdef APP || MP-WEIXIN
const recorderManager = uni.getRecorderManager();
// #endif
let timer = null;
const countUpData = reactive({
    m: '00',
    s: '00',
    leftTime: 0,
    seconds: 0,
    runing: false,
    syncFlag: false,
});

const audioSrc =ref('');
const alertDialogRef = ref();
const recordState = ref('');   // ready 有权限准备录音 recording 录音中 complete 完成

const countDown =()=> {
    let seconds = countUpData.seconds;
    let [minute, second] = [0, 0];
    if (seconds >= 0) {
        minute = Math.floor(seconds / 60); 
        second = Math.floor(seconds)  - (minute * 60);
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    countUpData.m = minute;
    countUpData.s = second;
};
const changeFlag = ()=>{
    if (!countUpData.syncFlag) {
        countUpData.seconds = 0;
        startCountUp(countUpData.seconds);
        countUpData.syncFlag = true;
    }
};
const startCountUp = (seconds=0)=>{
    if (countUpData.seconds <= 0) {
        countUpData.seconds = 0;
    }
    clearInterval(timer);
    countUpData.seconds = seconds;
    countUpData.runing = true;
    countDown();
    timer = setInterval(() => {
        countUpData.seconds++;
        countDown();
    }, 1000);
};
const resetCountUp=()=> {
    countUpData.runing = false;
    clearInterval(timer);	
    countUpData.m= '00';
    countUpData.s='00';
    countUpData.seconds = 0;
};
watch(()=> [countUpData.m,countUpData.s],()=>{
    changeFlag();
});
const recStart = ()=>{
    if(recordState.value==='recording') {
        return;
    }
    const options = {
        duration: 50000, // 录音时长，单位 ms
        sampleRate: 44100, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 192000, // 编码码率
        format: 'mp3' // 音频格式
    };
    // #ifdef APP || MP-WEIXIN
    recorderManager.start(options);
    // #endif
};
const recStop = ()=>{
    // #ifdef APP || MP-WEIXIN
    recorderManager.stop();
    // #endif
    resetCountUp();
};

const handlerDeleteAudio = ()=>{
    setState('');
};

const submitRecord = ()=>{
    emits('save-record',audioSrc.value);
};

const dialogConfirm = () => {
    alertDialogRef.value.close();
};
const dialogClose = () => {
    alertDialogRef.value.close();
};
const setState =(state)=>{
    recordState.value=state;
};

const getAudioUrl = (path)=>{
    audioSrc.value=path;
};

const handlerClose = ()=>{
    emits('close');
};
onMounted(()=>{
    // #ifdef APP || MP-WEIXIN
    recorderManager.onStart(()=>{
        startCountUp();
        setState('recording');
    });
    recorderManager.onStop((res)=>{
        setState('complete');
        getAudioUrl(res.tempFilePath);
        resetCountUp();
    });
    recorderManager.onError((errMsg)=>{
        Toast(errMsg);
    });
    // #endif
});
onUnmounted(()=>{
    setState('');
    resetCountUp();
});
onShow(()=>{
  
});

</script>


    
<style lang="scss" scoped>
.content {
  background-color: #fff;
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $uni-font-size-lg;
    padding-bottom: $uni-spacing-col-lg;
    border-bottom: 1px solid $uni-border-color;
    margin-bottom: 40rpx;
  }
  .control-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $uni-font-size-lg;
  }
}
</style>