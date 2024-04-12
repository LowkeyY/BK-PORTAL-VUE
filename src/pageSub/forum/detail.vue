<template>
    <app-provider>
        <nav-bar :title="name" />
        <view class="container">
            <view class="discussion-top">
                <img
                    :src="getImages(parent?.userpictureurl, 'defaultUserIcon')"
                    mode="widthFix"
                    style="width: 80rpx; height: 80rpx; border-radius: 80rpx; padding-right: 20rpx"
                    @error="(el) => getErrorImg(el, 'user')"
                />
                <view clss="top-msg">
                    <view style="font-size: 24rpx">{{ parent.userfullname }}</view>
                    <view style="color: #717171; font-size: 24rpx">{{ getCommonDate(parent.created) }}</view>
                </view>
            </view>
            <uni-title type="h2" :title="parent.subject"></uni-title>
            <render-html :html="parent.message" />
            <files-content
                v-if="parent.attachments !== ''"
                :show-title="false"
                :file-list="parent.attachments"
                @click="curAttachments = parent.attachments"
                @handle-download="handleDownload"
            />
            <view v-if="parent.aggregatelabel" class="aggregatelabel">
                {{ `${parent.aggregatelabel}${parent.aggregatestr === '' ? '-' : parent.aggregatestr}${parent.count ? `(${parent.count})` : ''}` }}
            </view>
            <view class="reply" @click="handleReply" v-if="parent.canreply && isAssessed === 'true'">
                <uni-icons type="chat" color="#2B83D7" size="26" style="padding-left: 10rpx"></uni-icons>
                <text>回复</text>
            </view>
            <view>
                <uni-section title="回复" type="line" style="background-color: transparent" />
                <pull-refresh-list :loading="loading" :has-more="false" :list-data="replyList" :is-refresh="isRefresh" @on-refresh="refresh">
                    <view>
                        <view v-for="(reply, index) in replyList" :key="index">
                            <view>
                                <view class="discussion-top">
                                    <img
                                        :src="getImages(reply?.userpictureurl, 'defaultUserIcon')"
                                        mode="widthFix"
                                        style="width: 80rpx; height: 80rpx; border-radius: 80rpx; padding-right: 20rpx"
                                        @error="(el) => getErrorImg(el, 'user')"
                                    />
                                    <view>
                                        <view class="subject-text">{{ reply.subject }}</view>
                                        <view style="color: #717171; font-size: 24rpx">{{ `由 ${reply.userfullname} 发布` }}</view>
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
                                <view v-if="reply.aggregatelabel" class="padding">
                                    {{
                                        `${reply.aggregatelabel}${reply.aggregatestr === '' ? '-' : reply.aggregatestr}${reply.count ? `(${reply.count})` : ''}`
                                    }}
                                </view>
                            </view>
                            <view class="bottom">
                                <view style="color: #717171; font-size: 24rpx"> {{ getCommonDate(reply.created) }}</view>
                                <view class="reply" @click="handleReply" v-if="reply.canreply && isAssessed === 'true'">
                                    <uni-icons type="chat" color="#2B83D7" size="26" style="padding-left: 10rpx"></uni-icons>
                                    <text>回复</text>
                                </view>
                            </view>
                            <render-children v-if="reply.children?.length > 0" :list="reply.children" />
                        </view>
                    </view>
                </pull-refresh-list>
            </view>
        </view>
    </app-provider>
</template>

<script setup lang="ts">
import { useForumStore } from '@/store/modules/forum';
import { getCommonDate, getCurPageParam, getErrorImg, getImages } from '@/utils';
import useLessonResource from '@/hooks/useLessonResource';
import { handleJumpToPage } from '@/utils/handle';
import RenderChildren from '@/pageSub/forum/components/renderChildren.vue';

const useForum = useForumStore();
const forumData = computed(() => useForum.forumData);
const parent = computed(() => useForum.parent);
const replyList = computed(() => useForum.replyList);
const { discussion, name, isAssessed } = getCurPageParam();

const loading = ref(false);
const isRefresh = ref(false);
const curAttachments = ref();

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

const refresh = async (callback: () => void) => {
    isRefresh.value = true;
    try {
        await useForum.queryForumComments({ discussionid: discussion });
    } finally {
        callback();
        isRefresh.value = false;
    }
};
onShow(async () => {
    await useForum.queryForumComments({ discussionid: discussion });
});
</script>

<style scoped lang="scss">
.padding {
    padding: 5rpx 0;
}
.container {
    padding: 10rpx 20rpx;
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
.aggregatelabel {
    margin-top: 20px;
    padding: 0 20px;
    color: #717171;
}
.reply {
    display: flex;
    justify-content: end;
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
</style>
