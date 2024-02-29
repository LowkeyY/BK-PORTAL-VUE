<!--
 * @Author: Lowkey
 * @Date: 2024-02-27 15:39:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-27 16:19:13
 * @FilePath: \BK-Portal-VUE\src\components\FilesContent\FilesContent.vue
 * @Description: 
-->

<template>
    <view>
        <uni-section title="附件" type="line" style="background-color: transparent;">
            <uni-list :border="true">
                <uni-list-item
                    v-for="(file,index) in fileList" :key="index" ellipsis="1" clickable
                    :title="file.fileName" :note="getCommonDate(file.uploadTime / 1000)"
                    @click="downloadFile(file,index)"
                >
                    <template #header>
                        <image class="icon" :src="getFileIcon(file.fileExt)" style="width: 60rpx;height: 60rpx;padding-right: 20rpx;" mode="heightFix" />
                    </template>
                    <template #footer>
                        <view class="download">
                            <button
                                style="color: #3492cf;background: #f0f8fd;border: 2rpx solid #3492cf;border-radius: 8rpx;font-size: 20rpx; padding: 0 8rpx;"
                                size="mini" plain="true" :loading="loading"
                            >
                                {{ loading?'下载中':`下载(${renderFileSize(file.fileSize)})` }}
                            </button>
                        </view>
                    </template>
                </uni-list-item>
            </uni-list>
        </uni-section>
    </view>
</template>

<script setup name="FilesContent">
import {getCommonDate, getFileIcon,renderFileSize} from '@/utils';


defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    fileList:{
        type:Array,
        default:()=>[]
    },
    title: {
        type: String,
        default: '附件'
    }
});
const emit = defineEmits(['handle-download']);
const downloadFile = (file,index)=>{
    emit('handle-download',file,index);
};
</script>

