
<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-19 16:47:40
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\page\index.vue
 * @Description: 
-->


<template>
    <app-provider>
        <nav-bar :title="navTitle" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="loading">
            <view class="content">
                <view class="title">{{ pageData.name }}</view>
                <uni-notice-bar v-if="pageData._useScriptFunc&&useApp._useJavaScriptMessage" show-close :text="useApp._useJavaScriptMessage.warn" />
                <render-html :html="pageData.content" :courseid="queryParams?.courseid" />
            </view>
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import { useUserStore } from '@/store/modules/user';
import { queryPageApi } from '@/services/resource';
import { useAppStore } from '@/store/app';
import { useSetLog } from '@/hooks/useSetLog';
import {useSystem} from '@/hooks/app/useSystem';
import { findNameByCourses } from '@/utils';
import {isEmpty} from  '@/utils/is';
import {Toast} from '@/utils/uniapi/prompt';


const { getResourceType } = useLessonResource();
const useUser = useUserStore();
const useApp = useAppStore();
const { setLog,setAccessTime} = useSetLog();
const navTitle = ref('');
const queryParams = ref<pageParams>();
const pageData = ref<Record<string,any>>({});
const startTime =ref();
const loading = ref<boolean>(false);
const handleRightClick = ()=>{
    console.log(23);
};

const query =async (params:pageParams)=>{
    loading.value = true;
 
    try {
        const data = await queryPageApi(params);
        if(data.success){
            pageData.value= data;
        }else{
            Toast(data.message||'获取资源失败');
        }
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }finally{
        loading.value=false;
        uni.stopPullDownRefresh();
    }
};

onPullDownRefresh(()=>{
    if(!isEmpty(queryParams.value)){
        query(queryParams.value as pageParams);
    }
});

onLoad(async (options) => {
    if (options) {
        startTime.value= new Date().getTime();
        const { courseid,modname,instance,cmid} = options;
        const userid = useUser.moodleUserId;
        const userfullname = useUser.portalUserName;
        const courseData = useApp.courseData;
        const username = useUser.userCode;
        const devicetype = useSystem().uniPlatform;
        navTitle.value= getResourceType(modname);
        const params = {
            cmid,
            userid,
            courseid,
            pageid:instance,
            modname,
            instance,
            coursename:findNameByCourses(courseData,courseid),
            userfullname,
            username,
            devicetype

        };
        queryParams.value = params;
        query(params);
        setLog({
            cmid,
            modname,
            courseid
        });
    }
});

onUnload(()=>{
    const {cmid,modname,courseid,userid} = queryParams.value as pageParams;
    setAccessTime({
        startedat:startTime.value,
        endedat: new Date().getTime(),
        cmid,
        modname,
        courseid,
        userid
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
