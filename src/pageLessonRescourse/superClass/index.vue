<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-19 16:48:03
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\superClass\index.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar :title="navTitle" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="loading">
            <view class="content">
                <view v-if="svpData.name" class="title">{{ svpData.name }}</view>
                <uni-notice-bar v-if="svpData._useScriptFunc && useApp._useJavaScriptMessage" show-close :text="useApp._useJavaScriptMessage.warn" />
                <render-html :html="svpData.content" />
            </view>
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import { useUserStore } from '@/store/modules/user';
import { querySvpApi } from '@/services/resource';
import { useAppStore } from '@/store/app';
import { useSetLog } from '@/hooks/useSetLog';
import { useSystem } from '@/hooks/app/useSystem';
import { findNameByCourses } from '@/utils';
import { isEmpty } from '@/utils/is';
import { Toast } from '@/utils/uniapi/prompt';

const { getResourceType } = useLessonResource();
const useUser = useUserStore();
const useApp = useAppStore();
const { setLog, setAccessTime } = useSetLog();
const navTitle = ref('');
const queryParams = ref({});
const svpData = ref<Record<string, any>>({});
const startTime = ref();
const loading = ref<boolean>(false);
const handleRightClick = () => {
    console.log(23);
};

const query = async (params: svpParams) => {
    loading.value = true;

    try {
        const data = await querySvpApi(params);
        if (data.success) {
            svpData.value = data;
        } else {
            Toast(data.message || '获取资源失败');
        }
        // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
        uni.stopPullDownRefresh();
    }
};

onPullDownRefresh(() => {
    if (!isEmpty(queryParams.value)) {
        query(queryParams.value as svpParams);
    }
});

onLoad(async (options) => {
    if (options) {
        startTime.value = new Date().getTime();
        const { courseid, modname, instance, cmid } = options;
        const userid = useUser.moodleUserId;
        const userfullname = useUser.portalUserName;
        const courseData = useApp.courseData;
        const username = useUser.userCode;
        const devicetype = useSystem().deviceModel;
        navTitle.value = getResourceType(modname);
        const params = {
            cmid,
            userid,
            courseid,
            chapterid: instance,
            modname,
            instance,
            coursename: findNameByCourses(courseData, courseid),
            userfullname,
            username,
            devicetype,
        };
        queryParams.value = params;
        query(params);
        setLog({
            cmid,
            modname,
            courseid,
        });
    }
});

onUnload(() => {
    const { cmid, modname, courseid, userid } = queryParams.value as svpParams;
    setAccessTime({
        startedat: startTime.value,
        endedat: new Date().getTime(),
        cmid,
        modname,
        courseid,
        userid,
    });
});
</script>
<style lang="scss" scoped>
.content {
    padding: $uni-container-padding;
    line-height: $uni-line-height;
    .title {
        font-size: $uni-font-size-lg;
        padding-bottom: 20rpx;
        border-bottom: 1px solid $uni-border-color;
    }
}
</style>
