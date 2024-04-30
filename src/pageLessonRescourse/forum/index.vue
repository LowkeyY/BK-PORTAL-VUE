<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-17 18:12:11
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\forum\index.vue
 * @Description:
-->

<template>
    <view>
        <nav-bar :title="navTitle" right-text="课程反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="useForum.loading&&!isRefresh">
            <uni-notice-bar
                v-if="forumData.type === 'qanda'"
                show-close
                scrollable
                text="这是一个问题和解答讨论区。为了能看到其他人的回应，您首先需要发表您的解答。"
            />
            <uni-notice-bar
                v-if="forumData.blockperiod > 0"
                show-close
                color="#ff5544"
                :text="`${getDurationDay(forumData.blockperiod)}内最多发 ${forumData.blockafter}个帖子`"
            />
            <view class="top-container">
                <uni-title type="h2" :title="forumData.name"></uni-title>
                <uni-title
                    v-if="forumData.assesstimestart !== 0 || forumData.assesstimefinish !== 0"
                    type="h3"
                    color="#ff5544"
                    :title="`发帖开放时间：${getCommonDate(forumData.assesstimestart, true, false)}至${getCommonDate(forumData.assesstimefinish, true, false)}`"
                ></uni-title>
                <expand-content max-height="300rpx">
                    <render-html :html="forumData.intro" :courseid="params?.courseid" />
                </expand-content>
                <button
                    v-if="forumData.cancreatediscussions && getIsAssessed() && getIsStartAssessed()"
                    type="default"
                    size="mini"
                    class="add-btn"
                    @click="handeAddForum(forumData)"
                >
                    开启一个新话题
                </button>
            </view>
            <uni-notice-bar
                v-if="!getIsAssessed()"
                show-close
                scrollable
                :text="`发帖时间已于${getCommonDate(forumData.assesstimefinish, true, false)}截至，您不能进行发帖和回帖了`"
            />
            <view>
                <view class="title-tip">
                    <image style="height: 50rpx; width: 50rpx; padding-right: 10rpx; background-color: transparent;" src="@/static/svg/talk.svg" />
                    <uni-title type="h3" :title="`话题（${forumData.numdiscussions}）`"></uni-title>
                </view>
                <pull-refresh-list :loading="loading" :has-more="false" :list-data="forumData.discussions" :is-refresh="isRefresh" @on-refresh="refresh">
                    <view>
                        <view v-for="(discussion, index) in forumData.discussions" :key="index" class="discussion" @click="handleDetail(discussion)">
                            <view class="discussion-top">
                                <img
                                    :src="getImages(discussion?.userpictureurl, 'defaultUserIcon')"
                                    mode="widthFix"
                                    style="width: 60rpx; height: 60rpx; border-radius: 80rpx; padding-right: 20rpx;"
                                    @error="(el) => getErrorImg(el, 'user')"
                                />
                                <text>{{ discussion.userfullname }}</text>
                            </view>
                            <view class="discussion-content">
                                <view style="margin-right: 20rpx;">
                                    <uni-tag
                                        v-if="discussion.pinned"
                                        text="置顶"
                                        :inverted="true"
                                        size="small"
                                        custom-style=" color: #f34e14;border-color:#f34e14;"
                                    >
                                    </uni-tag>
                                </view>
                                <view class="title-name">{{ discussion.subject }}</view>
                            </view>
                            <view class="discussion-bottom">
                                <view style="display: flex; align-items: center;">
                                    <uni-icons type="chat" size="26" color="#717171"></uni-icons>
                                    <view>{{ discussion.numreplies }}</view>
                                </view>
                                <view> {{ new Date(discussion.created * 1000).toLocaleString() }}</view>
                            </view>
                        </view>
                    </view>
                </pull-refresh-list>
            </view>
        </ComSkeleton>
    </view>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import { useForumStore } from '@/store/modules/forum';
import { getCommonDate, getDurationDay, getErrorImg, getImages } from '@/utils';
import { handleJumpToPage } from '@/utils/handle';

const { getResourceType } = useLessonResource();
const navTitle = ref('');
const useForum = useForumStore();
const forumData = computed(() => useForum.forumData);
const title = ref('');
const params = ref({});
const loading = ref(false);
const isRefresh = ref(false);

const handleRightClick = () => {
    console.log(23);
};
const getIsAssessed = () => {
    const cur = new Date().getTime() / 1000;
    if (forumData.value.assesstimefinish > 0) {
        return cur < forumData.value.assesstimefinish;
    }
    return true;
};

const getIsStartAssessed = () => {
    const cur = new Date().getTime() / 1000;
    if (forumData.value.assesstimestart > 0) {
        return cur > forumData.value.assesstimestart;
    }
    return true;
};

const refresh = async (callback: () => void) => {
    isRefresh.value = true;
    try {
        await useForum.queryForumCourse(params.value);
    } finally {
        callback();
        isRefresh.value = false;
    }
};

const handeAddForum = (forumData) => {
    const { maxattachments, maxbytes, id, course, groupid } = forumData;
    const params = { maxattachments, maxbytes, id, course, type: 'add', groupid };
    handleJumpToPage('addForum', params);
};

const handleDetail = (item) => {
    const cur = new Date().getTime() / 1000;
    const { discussion,subject } = item;
    const { assesstimefinish } = forumData.value;
    const params = { discussion,subject, isAssessed: cur < assesstimefinish };
    handleJumpToPage('forumDetail', params);
};

onLoad(async (options) => {
    if (options) {
        const { courseid, forumid, name, cmid,modname } = options;
        title.value = name;
        navTitle.value= getResourceType(modname);
        params.value = { courseid, forumid, cmid };
        await useForum.queryForumCourse(params.value);
    }
});
</script>
<style lang="scss" scoped>
.top-container {
  padding: $uni-container-padding;
  background-color: #fff;
}
.add-btn {
  color: #fff;
  background-color: #ff9a18;
  border-color: #ff9a18;
  margin: 40rpx 5rpx 10rpx;
}
.title-tip {
  display: flex;
  padding-left: 20rpx;
  align-items: center;
  height: 80rpx;
  background-color: #dbdbdb;
}
.discussion {
  padding: 10rpx 16rpx;
  border-bottom: 10rpx solid #f6f6f6;
  background-color: #fff;
  .discussion-top {
    height: 100rpx;
    display: flex;
    align-items: center;
  }
  .discussion-content {
    display: flex;
    align-items: center;
    .title-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 620rpx;
      font-size: 32rpx;
      font-weight: 600;
    }
  }
  .discussion-bottom {
    color: #717171;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0 10rpx;
  }
}
</style>
