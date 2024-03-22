<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-22 11:42:07
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\folder\index.vue
 * @Description: 
-->


<template>
    <app-provider>
        <nav-bar :title="navTitle" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="loading">
            <files-content :show-title="false" :file-list="filesData" @handle-download="handleDownload" />
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import { queryFolderApi } from '@/services/resource';
import { useSetLog } from '@/hooks/useSetLog';
import {isEmpty} from  '@/utils/is';
import {Toast} from '@/utils/uniapi/prompt';

const { getResourceType,handlerTagAHrefParseParam} = useLessonResource();
const { setLog} = useSetLog();
const navTitle = ref('');
const queryParams = ref({});
const filesData = ref<Record<string,any>>({});
const startTime =ref();
const loading = ref<boolean>(false);

const handleRightClick = ()=>{
    console.log(23);
};

const handleDownload = (file:Record<string,any>):void=>{
    const {fileurl,filesize} = file;
    const fileParams = {
        fileurl,
        filesize,
        modname:'resource'
    };
    handlerTagAHrefParseParam(fileParams);
};

const query =async (params:folderParams)=>{
    loading.value = true;
 
    try {
        const {success,data,message='获取资源失败'} = await queryFolderApi(params);
        if(success){
            filesData.value= data;
        }else{
            Toast(message);
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
        query(queryParams.value as folderParams);
    }
});

onLoad(async (options) => {
    if (options) {
        startTime.value= new Date().getTime();
        const { courseid,modname,cmid} = options;
        navTitle.value= getResourceType(modname);
        const params = {
            cmid,
            courseid
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
