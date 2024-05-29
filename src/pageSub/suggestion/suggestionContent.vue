<!--
 * @Author: Lowkey
 * @Date: 2024-05-20 12:06:49
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-20 13:17:30
 * @FilePath: \BK-Portal-VUE\src\pageSub\suggestion\suggestionContent.vue
 * @Description: 
-->

<template>
    <view>
        <nav-bar title="我的反馈" />
        <ComSkeleton type="text" :loading="loading">
            <view class="container">
                <view class="head">
                    <view class="head-info">
                        <view class="type">{{ content.submitType }}</view>
                        <uni-tag
                            :text="content.currentStatus === '0' ? '未回复' : '已回复'"
                            :type="content.currentStatus === '0' ? 'error' : 'success'"
                            size="mini"
                        ></uni-tag>
                    </view>
                    <view class="date">
                        {{ getCommonDate(content.submitDate / 1000) }}
                    </view>
                </view>
                <view class="content">
                    <view class="content-text">{{ content.submitContent }}</view>
                    <view class="content-images">
                        <image
                            v-for="(img, index) in images"
                            :key="index"
                            class="images"
                            :src="`${content.baseHost}${img}`"
                            mode="scaleToFill"
                            @tap="() => previewImage(content, index)"
                        />
                    </view>
                </view>
                <view class="reply">
                    <uni-section type="line" title="回复" />
                </view>
            </view>
        </ComSkeleton>
    </view>
</template>
<script lang="ts" setup>
import { querySuggestionDetailApi } from '@/services/suggestion';
import { Toast } from '@/utils/uniapi/prompt';
import { getCommonDate } from '@/utils';
const loading = ref(false);
const content = ref({});
const images = ref([]);
const queryContent = async (params) => {
    try {
        loading.value = true;
        const { data, success, msg } = await querySuggestionDetailApi(params);
        if (success) {
            const { submitAnnex = '' } = data;
            content.value = data;
            images.value = submitAnnex.split(',');
        } else {
            Toast(msg);
        }
        // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
    }
};
const previewImage = (content, index: number) => {
    const urls: string[] = images.value.map((item) => `${content.baseHost}${item}`);
    uni.previewImage({
        urls,
        current: urls[index],
    });
};

onLoad(async (options) => {
    if (options) {
        const { opinionId } = options;
        queryContent({ opinionId });
    }
});
</script>
<style lang="scss" scoped>
.container {
    .head {
        padding: $uni-container-padding;
        background-color: #fff;
        border-bottom: 1px solid $uni-border-color;
        .head-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20rpx;
        }
        .date {
            color: $uni-color-subtitle;
            font-size: $uni-font-size-m;
            text-align: right;
        }
    }
    .content {
        padding: 30rpx;
        background-color: #fff;
        font-size: $uni-font-size-m;
        .content-text {
            margin-bottom: 30rpx;
        }
        .content-images {
            padding: 10rpx 10rpx 0;
            background-color: #f6f6f6;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .images {
                border-radius: 10px;
                flex-basis: 49%;
                margin-bottom: 10rpx;
            }
        }
    }
    .reply {
        margin-top: 10rpx;
    }
}
</style>
