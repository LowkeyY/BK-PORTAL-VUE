<template>
    <view class="chat">
        <nav-bar title="聊天详情" />
        <scroll-view
            id="scrollview"
            scroll-y="true"
            :scroll-top="scrollTop"
            class="scroll-view"
        >
            <!-- 聊天主体 -->
            <view id="msglistview" class="chat-body">
                <!-- 聊天记录 -->
                <view v-for="(item,index) in msgList" :key="index" style="padding-bottom: 20rpx">
                    <view class="time">{{ getShowTimer(index) }}</view>
                    <!-- 自己发的消息 -->
                    <view v-if="item.useridfrom!=useridfrom" class="item self">
                        <button :plain="true" :loading="!item.id" style="border: none"></button>
                        <view class="content right">
                            {{ item.details }}
                        </view>
                        <image class="avatar" :src="getPortalAvatar(curFileUrl, useUser.curUserInfo?.headImg || useUser.ouchnUserInfo?.headImg)" @error="el=>getErrorImg(el,'user')" />
                    </view>
                    <view v-if="item.useridfrom==useridfrom" class="item">
                        <image class="avatar" :src="getImages(curFormAvatar,'defaultUserIcon')" @error="el=>getErrorImg(el,'user')" />
                        <view class="content left">
                            {{ item.details }}
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <!-- 底部消息发送栏 -->
        <view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
            <view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
                <view class="uni-textarea">
                    <textarea
                        v-model="chatMsg"
                        maxlength="300"
                        confirm-type="send"
                        :show-confirm-bar="false"
                        :adjust-position="false"
                        auto-height
                        @linechange="sendHeight" @focus="focus"
                        @keyboardheightchange="onkeyboardHeightChange"
                    ></textarea>
                </view>
                <button class="send-btn" @click="handleSend">发送</button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>

import { getCurPageParam, getErrorImg, getImages, getMessageTime, getPortalAvatar } from '@/utils';
import { useConversationStore } from '@/store/modules/conversation';
import { useUserStore } from '@/store/modules/user';
import { getBaseUrl } from '@/utils/env';

const useConversation=useConversationStore();
const useUser = useUserStore();
const pageParams = getCurPageParam();
const { PORTAL_SERVER } = getBaseUrl();
const curFileUrl = `${PORTAL_SERVER}/file/downloadFile`;
const { userName,useridfrom,avatar,token} = pageParams;
const curFormAvatar=`${avatar}&token=${token}`;
const windowHeight=uni.getSystemInfoSync().windowHeight;
//键盘高度
const keyboardHeight=ref(0);
//底部消息发送高度
const bottomHeight=ref(0);
//滚动距离
const scrollTop=ref(0);
const userId=ref('');
//发送的消息
const chatMsg=ref('');
const curIndex=ref(0);
const msgList=computed(() => useConversation.conversationData);
const inputHeight=computed(() => bottomHeight.value+keyboardHeight.value);
const getShowTimer = (index) => {
    const timeDifference = (msgList.value[index]?.timecreated-msgList.value[index-1]?.timecreated)*1000 ||0;
    const threshold = 3 * 60 * 1000;
    if(msgList.value[index]&&index===0){
        return getMessageTime(msgList.value[index]?.timecreated);
    }
    if(msgList.value[index]?.timecreated&&msgList.value[index-1]?.timecreated&&(timeDifference>threshold)){
        return getMessageTime(msgList.value[index]?.timecreated);
    }else{
        return '';
    }
};

// px转换成rpx
const rpxTopx=(px)=>{
    let deviceWidth = uni.getSystemInfoSync().windowWidth;
    let rpx = ( 750 / deviceWidth ) * Number(px);
    return Math.floor(rpx);
};
// 监视聊天发送栏高度
const sendHeight=()=>{
    setTimeout(()=>{
        let query = uni.createSelectorQuery();
        query.select('.send-msg').boundingClientRect();
        query.exec(res =>{
            bottomHeight.value = rpxTopx(res[0].height);
        });
    },10);
};

const onkeyboardHeightChange = (e) => {
    const {height}=e.detail;
    if(height){
        keyboardHeight.value = rpxTopx(height);
        if(keyboardHeight.value<0){
            keyboardHeight.value=0;
        }
    }
};
const handleSend =async () => {
    msgList.value.push({useridfrom: useUser.moodleUserId, useridto: useridfrom,details:chatMsg.value});
    const curData={
        text:chatMsg.value,
        touserid:useridfrom,
        key:curIndex.value,
        isMySelf: `${curIndex.value++}`,
        state: 1
    };
    await useConversation.sendConversation(curData);
    const curParams={
        fromuserid:useridfrom,
        userid:useUser.moodleUserId,
        nowpage:1
    };
    await useConversation.queryConversation(curParams);
    chatMsg.value=true;
};

onLoad(async ()=>{
    const curParams={
        fromuserid:useridfrom,
        userid:useUser.moodleUserId,
        nowpage:1
    };
    await useConversation.queryConversation(curParams);
    const query = uni.createSelectorQuery().in(this);
    query.select('.scroll-view').boundingClientRect(data => {
        if (data) {
            uni.pageScrollTo({
                scrollTop: data.bottom,
                duration: 10
            });
        }
    }).exec();
});
</script>
<style lang="scss" scoped>
$chatContentbgc: #9ee62a;
$sendBtnbgc: #4f7df5;
view,
button,
text,
input,
textarea {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 聊天消息 */
.chat {
  .topTabbar {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    display: flex;
    margin-top: 80rpx;
    justify-content: space-between;
    .icon {
      margin-left: 20rpx;
    }
    .text {
      margin: auto;
      font-size: 16px;
      font-weight: 700;
    }
    .button {
      width: 10%;
      margin: auto 20rpx auto 0rpx;
    }
  }
  .scroll-view {
      height: calc(100% - 80rpx);
    ::-webkit-scrollbar {
      display: none;
      width: 0 !important;
      height: 0 !important;
      appearance: none;
      background: transparent;
      color: transparent;
    }

    // background-color: orange;
    background-color: #f6f6f6;
    .chat-body {
      display: flex;
      flex-direction: column;
      padding-top: 30rpx;
      .self {
        justify-content: flex-end;
      }
      .item {
        display: flex;
        padding: 12rpx 30rpx;
        align-items: start;
        .right {
          background-color: $chatContentbgc;
        }
        .left {
          background-color: #fff;
        }
        // 聊天消息的三角形
        .right::after {
          position: absolute;
          display: inline-block;
          content: '';
          width: 0;
          height: 0;
          left: 100%;
          top: 10px;
          border: 12rpx solid transparent;
          border-left: 12rpx solid $chatContentbgc;
        }
        .left::after {
          position: absolute;
          display: inline-block;
          content: '';
          width: 0;
          height: 0;
          top: 10px;
          right: 100%;
          border: 12rpx solid transparent;
          border-right: 12rpx solid #fff;
        }
        .content {
          position: relative;
          max-width: 486rpx;
          word-wrap: break-word;
          padding:10rpx 20rpx;
          margin:10rpx 20rpx;
          border-radius: 10rpx;
          font-size: $uni-font-size-base;
          font-weight: 500;
          color: #333;
        }
        .avatar {
          display: flex;
          justify-content: center;
          width: 78rpx;
          height: 78rpx;
          border-radius: 50rpx;
          overflow: hidden;
          image {
            align-self: center;
          }
        }
      }
    }
  }
.time{
    width: 100%;
    text-align: center;
    font-size:$uni-font-size-sm;
    color: #999
}
  /* 底部聊天发送栏 */
  .chat-bottom {
    width: 100%;
    height: 100rpx;
    background: #f4f5f7;
    transition: all 0.1s ease;
    .send-msg {
      display: flex;
      align-items: flex-end;
      padding: 16rpx 30rpx;
      width: 100%;
      min-height: 177rpx;
      position: fixed;
      bottom: 0;
      background: #fff;
      transition: all 0.1s ease;
    }
    .uni-textarea {
      padding-bottom: 70rpx;
      textarea {
        width: 537rpx;
        min-height: 75rpx;
        max-height: 500rpx;
        background: #f1f1f1;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-family: 'PingFang SC';
        color: #333;
        line-height: 74rpx;
        padding: 5rpx 8rpx;
        text-indent: 30rpx;
      }
    }
    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 76rpx;
      margin-left: 25rpx;
      width: 120rpx;
      height: 75rpx;
      background: #2b83d7;
      border-radius: 50rpx;
      font-size: 28rpx;
      font-family: 'PingFang SC';
      font-weight: 500;
      color: #fff;
      line-height: 28rpx;
    }
  }
}
.loading-btn{
    background-color: transparent;
    border: null;
}
</style>
