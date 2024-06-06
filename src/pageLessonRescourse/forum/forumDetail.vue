<template>
    <view>
        <nav-bar :title="subject" />
        <ComSkeleton type="text" :loading="useForum.detailLoading">
            <view class="target-subject">
                <view class="discussion-top">
                    <img
                        :src="getImages(parent?.userpictureurl, 'defaultUserIcon')"
                        mode="widthFix"
                        style="width: 80rpx; height: 80rpx; border-radius: 80rpx; padding-right: 20rpx;"
                        @error="(el) => getErrorImg(el, 'user')"
                    />
                    <view clss="top-msg">
                        <view style="font-size: 24rpx;">{{ parent.userfullname }}</view>
                        <view style="color: #717171; font-size: 24rpx;">{{ getCommonDate(parent.created) }}</view>
                    </view>
                </view>
                <uni-title type="h2" :title="parent.subject" />
                <render-html :html="parent.message" />
                <view class="files-container">
                    <files-content
                        v-if="parent.attachments !== ''"
                        :show-title="false"
                        :file-list="parent.attachments"
                        @click="curAttachments = parent.attachments"
                        @handle-download="handleDownload"
                    />
                </view>
                <view class="actions">
                    <view class="padding">
                        {{ `${parent.aggregatelabel}${parent.aggregatestr === '' ? '-' : parent.aggregatestr}${parent.count ? `(${parent.count})` : ''}` }}
                    </view>
                    <view class="rating">
                        <score-combox style="width: 45%;height: 100%;" :rate-range="rateRange" />
                        <button v-if="parent.canreply" type="primary" class="reply-btn" @click="handleReply">回复</button>
                    </view>
                </view>
            </view>
            <uni-section title="回复列表" type="line" style="margin-bottom: 6rpx;" />
            <view class="reply-content">
                <view v-for="(reply, index) in replyList" :key="index">
                    <view>
                        <view class="discussion-top">
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

                    <view class="actions">
                        <view v-if="reply.aggregatelabel" class="padding">
                            {{ `${reply.aggregatelabel}${reply.aggregatestr === '' ? '-' : reply.aggregatestr}${reply.count ? `(${reply.count})` : ''}` }}
                        </view>
                        <view class="rating">
                            <score-combox style="width: 45%;height: 100%;" :rate-range="rateRange" />
                            <button v-if="reply.canreply" type="primary" class="reply-btn" @click="handleReply">回复</button>
                        </view>
                    </view>
                    <render-children v-if="reply.children?.length > 0" :rate-range="rateRange" :list="reply.children" />
                </view>
            </view>
        </ComSkeleton>
    </view>
</template>

<script setup lang="ts">
import { useForumStore } from '@/store/modules/forum';
import { getCommonDate, getCurPageParam, getErrorImg, getImages } from '@/utils';
import useLessonResource from '@/hooks/useLessonResource';
import { handleJumpToPage } from '@/utils/handle';
import RenderChildren from './components/renderChildren.vue';
import ScoreCombox from '@/components/ScoreCombox/ScoreCombox.vue';
import {isEmpty} from '@/utils/is';

const useForum = useForumStore();
const forumData = computed(() => useForum.forumData);
const parent = computed(() => useForum.parent);
const replyList = computed(() => useForum.replyList);
const { discussion, subject, isAssessed } = getCurPageParam();
const rateRange = computed(() => {
    const array = Array.from({ length: 101 }, (_, i) => 100 - i + '');
    return array;
});
const curAttachments = ref();
const queryParams=ref({});
const { handlerTagAHrefParseParam } = useLessonResource();

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

const handleReply = () => {
    const { maxattachments, maxbytes } = forumData.value;
    const { id, subject, discussion } = parent.value;
    const curParams = { id, subject, discussionid: discussion, maxattachments, maxbytes, type: 'reply' };
    handleJumpToPage('addForum', curParams);
};

onPullDownRefresh(async ()=>{
    if(!isEmpty(queryParams.value)){
        await useForum.queryForumComments({ discussionid: discussion });
    }
});
onShow(async () => {
    queryParams.value={ discussionid: discussion };
    await useForum.queryForumComments({ discussionid: discussion });
});
</script>

<style scoped lang="scss">
.padding {
  padding: 5rpx 0;
}
.target-subject {
  padding: 20rpx 20rpx 40rpx;
  background-color: #fff;
  border-bottom: 1px solid $uni-border-color;
}
.files-container {
  margin: 20rpx 0;
}
.reply-content {
  padding: $uni-container-padding;
  background-color: #fff;
}
.discussion-top {
  display: flex;
  align-items: center;
  height: 100rpx;
  .top-msg {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100rpx;
  }
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
    padding-bottom: 20rpx;
  .aggregatelabel {
    color: #717171;
  }
  .reply {
    display: flex;
    align-items: center;
    color: #2b83d7;
  }
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
.subject-text {
  font-size: 28rpx;
  width: 550rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 5rpx;
}
</style>
