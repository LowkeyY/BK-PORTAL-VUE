<!--
 * @Author: Lowkey
 * @Date: 2024-02-27 15:39:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-22 11:43:01
 * @FilePath: \BK-Portal-VUE\src\components\FilesContent\FilesContent.vue
 * @Description:
-->

<template>
    <view v-if="isArray(fileList) && fileList.length">
        <uni-section v-if="showTitle" title="附件" type="line" style="background-color: transparent" />
        <uni-list :border="true">
            <uni-list-item v-for="(file, index) in fileList" :key="index" ellipsis="1" clickable @click="downloadFile(file, index)">
                <template #header>
                    <view class="icon">
                        <image :src="getFileIcon(file[propertyValue.fileName])" style="width: 60rpx; height: 80rpx; padding-right: 20rpx" mode="scaleToFill" />
                    </view>
                </template>
                <template #body>
                    <view class="content">
                        <view class="name text-ellipsis-1">{{ file[propertyValue.fileName] }}</view>
                        <view class="info">
                            <view class="time">
                                {{ getCommonDate(file[propertyValue.fileTime] / (propertyValue.fileTime === 'uploadTime' ? 1000 : 1)) }}
                            </view>
                            <view class="size">
                                {{ renderFileSize(file[propertyValue.fileSize]) }}
                            </view>
                        </view>
                    </view>
                </template>
                <!-- <template #footer>
                        <view>
                            <button
                                style="color: #3492cf;background: #f0f8fd;border: 2rpx solid #3492cf;border-radius: 8rpx;font-size: 20rpx; padding: 0 8rpx;"
                                size="mini" plain="true"
                            >
                                {{ `查看(${renderFileSize(file[propertyValue.fileSize])})` }}
                            </button>
                        </view>
                    </template> -->
            </uni-list-item>
        </uni-list>
    </view>
</template>

<script setup name="FilesContent">
import { getCommonDate, getFileIcon, renderFileSize } from '@/utils';
import { isArray } from '@/utils/is';

defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    showTitle: {
        type: Boolean,
        default: true,
    },
    fileList: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: '附件',
    },
    propertyValue: {
        type: Object,
        default: () => ({
            fileName: 'filename',
            fileSize: 'filesize',
            fileTime: 'timemodified',
        }),
    },
});
const emit = defineEmits(['handle-download']);
const downloadFile = (file) => {
    emit('handle-download', file);
};
</script>

<style lang="scss" scoped>
.icon {
    width: 10%;
}
.content {
    width: 90%;
    .name {
        font-size: $uni-font-size-lg;
        margin-bottom: 12rpx;
    }
    .info {
        display: flex;
        justify-content: space-between;
        font-size: $uni-font-size-base;
        color: $uni-color-subtitle;
        .size {
            color: #fdb121;
        }
    }
}
</style>
