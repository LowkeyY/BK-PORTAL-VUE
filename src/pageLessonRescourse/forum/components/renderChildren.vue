<template>
    <view class="child-container">
        <view v-for="(reply, index) in list" :key="index" class="item-container">
            <view style="display: flex;">
                <view class="item-top">
                    <img
                        :src="getImages(reply?.userpictureurl, 'defaultUserIcon')"
                        mode="widthFix"
                        style="width: 80rpx; height: 80rpx; border-radius: 80rpx; padding-right: 20rpx;"
                        @error="(el) => getErrorImg(el, 'user')"
                    />
                    <view>
                        <view class="subject-text">{{ reply.subject }}</view>
                        <view style="color: #717171; font-size: 24rpx;"> {{ getCommonDate(reply.created) }}</view>
                    </view>
                </view>
                <view>{{ `#${reply.level}` }}</view>
            </view>
            <view>
                <render-html class="padding" :html="reply.message" />
                <files-content
                    v-if="reply.attachments !== ''"
                    class="padding"
                    :show-title="false"
                    :file-list="reply.attachments"
                    @click="curAttachments = reply.attachments"
                    @handle-download="handleDownload"
                />
            </view>
            <view class="bottom">
                <view v-if="reply.aggregatelabel" class="padding">
                    {{ `${reply.aggregatelabel}${reply.aggregatestr === '' ? '-' : reply.aggregatestr}${reply.count ? `(${reply.count})` : ''}` }}
                </view>
                <view class="rating">
                    <score-combox style="width: 45%;height: 100%;" :rate-range="rateRange"/>
                    <button type="primary" class="reply-btn" @click="handleReply">回复</button>
                </view>
            </view>
            <render-children :candidates="rateRange" v-if="reply.children?.length > 0" :list="reply.children" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { useForumStore } from '@/store/modules/forum';
import { getCommonDate, getErrorImg, getImages } from '@/utils';
import useLessonResource from '@/hooks/useLessonResource';
import { handleJumpToPage } from '@/utils/handle';
import ScoreCombox from "@/components/ScoreCombox/ScoreCombox.vue";

defineProps({
    list: {
        type: Array,
        default: () => [],
    },
    rateRange:{
        type: Array,
        default: () => [],
    }
});

const { handlerTagAHrefParseParam } = useLessonResource();
const useForum = useForumStore();
const forumData = computed(() => useForum.forumData);
const curAttachments = ref();
const handleDownload = (file: Record<string, any>, index: number): void => {
    const { fileurl, filename, mimetype, timemodified } = file;
    const { fileIdPrefix = '' } = curAttachments.value[index];
    const fileParams = {
        fileurl,
        filename,
        mimetype,
        modname: 'resource',
        fileIdPrefix: `${fileIdPrefix}${fileIdPrefix && fileIdPrefix.indexOf(String(fileIdPrefix.length - 1)) === '_' ? '' : '_'}`,
    };
    handlerTagAHrefParseParam(fileParams);
};

const handleReply = (reply) => {
    const { maxattachments, maxbytes } = forumData.value;
    const { id, subject, discussion } = reply;
    const curParams = { id, subject, discussionid: discussion, maxattachments, maxbytes, type: 'reply' };
    handleJumpToPage('addForum', curParams);
};
</script>

<style scoped lang="scss">
.padding {
  padding: 10rpx 0;
    margin: 10rpx 0;
}
.child-container {
  margin: 1rpx;
}
.item-container {
  border: 2rpx solid #ddd;
  padding: 10rpx;
  background-color: #fbfbfb;
}
.item-top {
  display: flex;
  align-items: center;
  height: 100rpx;
  width: 90%;
  .top-msg {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100rpx;
  }
}
.aggregatelabel {
  margin-top: 20px;
  padding: 0 20px;
  color: #717171;
}
.reply {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #2b83d7;
}
.subject-text {
  font-size: 28rpx;
  width: 550rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 5rpx;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
}
.rating {
    display: flex;
    width: 60%;
    height: 70rpx;
    .reply-btn {
        height: 100%;
        width: 45%;
        line-height: 70rpx;
        text-align: center;
        font-size: 28rpx;
    }
}
</style>
