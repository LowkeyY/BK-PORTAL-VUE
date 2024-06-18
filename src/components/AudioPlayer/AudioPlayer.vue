<template>
    <view class="audio-content">
        <view class="audio-btn">
            <view class="play-box">
                <view class="play-btn" :style="{backgroundColor:isPaused?'#00CA86':'#475266'}" @click="onPlayPause">
                    <image v-show="isPaused" src="./icon/suspend.svg"></image>
                    <image v-show="!isPaused" src="./icon/start.svg"></image>
                </view>
            </view>
            <!-- <image v-if="!showAudioSpeedIcon"></image>
            <image v-if="showAudioSpeedIcon" src="./icon/multiple.svg" @tap="onSpeed"></image>
            <text v-if="showAudioSpeedIcon" class="speed-text" @tap="onSpeed">x{{ speed }}</text> -->
        </view>
        <view style="flex: 1;">
            <!-- #ifdef H5 -->
            <video
                id="audio-player" 
                style="display: none;"
                :autoplay="autoplay"
                :src="audioSrc" 
                @error="onError" 
                @timeupdate="setPlayData"
                @loadedmetadata="onCanplay"
                @play="onPlay"
                @pause="onPause"
                @ended="onEnded"
            >
            </video>
            <!-- #endif -->
            <view class="audio-progress">
                <view class="audio-bar">
                    <slider 
                        class="audio-slider" 
                        :value="currentTime" 
                        :min="0" 
                        :max="duration" 
                        active-color="#00CA86"
                        background-color="#DAE0E6" 
                        block-color="#00CA86" 
                        block-size="18" 
                        @change="sliderChange"
                        @changing="sliderChanging"
                    />
                </view>
            </view>
            <view class="bar-tips">
                <text>{{ minTimeFmt(currentTime) }}</text>
                <text>{{ minTimeFmt(duration) }}</text>
            </view>
        </view>
    </view>
</template>

<script>
let innerAudioContext = null;
export default {
    name: 'AudioPlayer',
    props: {
        audioSrc: {
            type: String,
            default:''
        },
        // 是否显示播放倍速
        showAudioSpeedIcon: {
            type: Boolean,
            default: false
        },
        // 是否自动播放
        autoplay:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isPaused: true, //是否暂停中
            duration: 0, //音频时长
            currentTime: 0, //当前时长
            speed: 1, //倍速
            isSlidering: false, //是否移动中
            isEndAcudio: false, //最后一个音频结束
            isAutoplay:false
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.startPlay();
            this.setAudioInfo();
        });
    },
    beforeUnmount() {
        // #ifdef MP-ALIPAY || MP-LARK
        innerAudioContext.destroy();
        // #endif
        // #ifdef H5
        innerAudioContext.pause();
        // #endif
    },
    methods: {
        minTimeFmt(val) {
            let minute = parseInt(val / 60);
            let seconds = Math.ceil(val % 60);
            return `${minute>=10?minute:'0'+minute}:${seconds>=10?seconds:'0'+seconds}`;
        },
        startPlay() {
            // #ifdef H5
            innerAudioContext = uni.createVideoContext('audio-player');
            // #endif
            // #ifdef MP-ALIPAY || MP-LARK
            innerAudioContext = uni.createInnerAudioContext();
            // #endif
            // #ifndef H5 || MP-ALIPAY || MP-LARK
            innerAudioContext = uni.getBackgroundAudioManager();
            // #endif
            /*
				play		播放（H5端部分浏览器需在用户交互时进行）	
				pause		暂停	
				stop		停止	
				seek	position	跳转到指定位置，单位 s	
				destroy		销毁当前实例
				*/
            innerAudioContext.startTime = 0; //开始播放的位置（单位：s）
            this.setAudioInfo();
            // #ifdef H5
            innerAudioContext.playbackRate(1.0);
            // #endif
            // #ifndef H5
            innerAudioContext.playbackRate = this.speed; //放的倍率。可取值：0.5/0.8/1.0/1.25/1.5/2.0
            // 音频播放事件
            innerAudioContext.onPlay(() => {
                this.onPlay();
            });
            // 音频暂停事件
            innerAudioContext.onPause(() => {
                this.onPause();
            });
            // 音频进入可以播放状态，但不保证后面可以流畅播放
            innerAudioContext.onCanplay(() => {
                this.onCanplay();
            });
            // 音频自然播放结束事件
            innerAudioContext.onEnded(() => {
                this.onEnded();
            });
            // 音频播放错误事件
            innerAudioContext.onError((res) => {
                this.onError(res);
            });
            // 音频播放进度更新事件
            innerAudioContext.onTimeUpdate(() => {
                this.setPlayData();
            });
            // #endif
        },
        // 暂停播放切换
        onPlayPause() {
            if (this.isPaused) {
                if (this.isEndAcudio) {
                    innerAudioContext.src = encodeURI(this.audioSrc).replace(/\+/g, '%2B'); //音频的数据链接，用于直接播放。
                }
                innerAudioContext.play();
                this.isPaused = false;
            } else {
                innerAudioContext.pause();
                this.isPaused = true;
            }
        },

        // 调整播放倍速
        onSpeed() {
            if (this.speed === 1) {
                // #ifdef H5
                innerAudioContext.playbackRate(1.5);
                this.speed = 1.5;
                // #endif
                // #ifndef H5
                innerAudioContext.playbackRate = 2.0;
                this.speed = 2;
                // #endif
            } else {
                // #ifdef H5
                innerAudioContext.playbackRate(1.0);
                // #endif
                // #ifndef H5
                innerAudioContext.playbackRate = 1.0;
                // #endif
                this.speed = 1;
            }
        },
        // 滑块滚动到的位置
        sliderChange(e) {
            this.isSlidering = false;
            this.currentTime = e.detail.value;
            innerAudioContext.seek(e.detail.value);
        },
        // 滑块滚动到的位置 实时
        sliderChanging(e) {
            this.isSlidering = true;
            this.currentTime = e.detail.value;
        },
        // 设置以及转换信息
        setPlayData(event) {
            // #ifndef H5
            if (this.isSlidering) return;
            if (!innerAudioContext.duration && !innerAudioContext.currentTime) return;
            this.duration = innerAudioContext.duration || 0;
            this.currentTime = innerAudioContext.currentTime || 0;
            // #endif
            // #ifdef H5
            if (this.isSlidering) return;
            this.duration = event.detail.duration  || 0;
            this.currentTime = event.detail.currentTime || 0;
            // #endif
        },
        // 设置播放
        setAudioInfo() {
            if (innerAudioContext && this.audioSrc) {
                innerAudioContext.src = encodeURI(this.audioSrc).replace(/\+/g, '%2B'); //音频的数据链接，用于直接播放。
              
                if(this.isAutoplay||this.autoplay){
                    innerAudioContext.play();
                }else{
                    setTimeout(()=>{
                        innerAudioContext.pause();
                    },100);
                    this.isAutoplay = true;
                }
            }
            if (!this.audioSrc) {
                this.duration = 0;
                this.currentTime = 0;
                this.isPaused = true;
                innerAudioContext.pause();
            }
        },
        // 播放事件
        onPlay(){
            // console.log('音频播放事件');
            this.isEndAcudio = false;
            this.isSlidering = false;
            this.isPaused = false;
        },
        // 暂停事件
        onPause(){
            // console.log("音频暂停事件");
            this.isPaused = true;
        },
        // 播放结束事件
        onEnded(){

            // console.log("音频自然播放结束事件");
        },
        // 音频进入可以播放状态
        onCanplay(event){
            // console.log('音频进入可以播放状态，但不保证后面可以流畅播放');
            // console.log("音频时长：", innerAudioContext.duration)
            this.isSlidering = false;
            this.setPlayData(event);
        },
        // 播放失败
        onError(res) {
            // console.log("音频播放错误事件", res);
            this.duration = 0;
            this.currentTime = 0;
            this.isPaused = true;
            innerAudioContext.pause();
        },		
    }
};
</script>

<style lang="scss" scoped>
  .audio-content {
    width: 100%;
    padding: 0 30rpx;
    margin: 30rpx 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .audio-progress {
      display: flex;
      align-items: center;
      justify-content: space-between;
      image {
        width: 48rpx;
        height: 48rpx;
      }
      .audio-bar {
        flex: 1;
        padding: 0 26rpx;
        box-sizing: border-box;
        .audio-slider {
          margin: 0 !important;
        }
      }
    }
    .bar-tips {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 74rpx;
      margin-bottom: 32rpx;
      color: #b8becc;
      font-size: $uni-font-size-m;
      line-height: 1em;
    }
    .audio-btn {
      position: relative;
      display: flex;
      margin-bottom: 30rpx;
      image {
        width: 36rpx;
        height: 36rpx;
      }
      .play-box {
        display: flex;
        align-items: center;
      }
      .play-btn {
        width: 72rpx;
        height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        background: #475266;
        border-radius: 50%;
        image {
          width: 96rpx;
          height: 96rpx;
        }
      }
      .speed-text {
        position: absolute;
        top: 20rpx;
        right: 0;
        color: #475266;
        font-size: 16rpx;
        font-weight: 600;
      }
    }
  }
</style>