<!--
 * @Author: Lowkey
 * @Date: 2024-02-07 12:51:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-07 11:35:16
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\ResourceList.vue
 * @Description: 
-->
<template>
    <view v-for="item in list" :key="item.id" class="content">
        <view v-if="item.modname === 'label'" class="label-content">
            <render-html :html="item.description" :courseid="courseid" />
            <StatusIcon
                v-if="String(item.tracking) !== ResourceTracking.NONE"
                :id="item.id"
                :state="String(item.stats.state)"
                :tracking="String(item.tracking)"
            />
        </view>
        <view v-else class="resource-container">
            <view class="content" @click="() => handleResourceClick(item, courseid)">
                <image
                    :class="['icon', item.availabilityinfo && 'disabled']"
                    :src="getImages(item.modicon.replace(pattern('svg'), 'fordson'))"
                    mode="widthFix"
                />
                <view :class="['right-content', item.availabilityinfo && 'disabled']">
                    <view class="name">{{ item.name }}</view>
                    <StatusIcon
                        v-if="String(item.tracking) !== ResourceTracking.NONE"
                        :id="item.id"
                        :state="String(item.stats.state)"
                        :tracking="String(item.tracking)"
                    />
                </view>
            </view>
            <view v-if="item.description" class="description">
                <expand-content>
                    <render-html :html="item.description" :courseid="courseid" />
                </expand-content>
            </view>
            <view v-if="item.availabilityinfo" class="availabilityinfo">
                <render-html :html="item.availabilityinfo" :courseid="courseid" :tag-style="availabilityinfoHtmlStyles" />
            </view>
        </view>
    </view>
</template>

<script setup name="ResourceList">
import useLessonResource from '@/hooks/useLessonResource';
import StatusIcon from './StatusIcon.vue';
import { getImages, pattern } from '@/utils';
import { ResourceTracking } from '@/enums/statusEnum';
import { availabilityinfoHtmlStyles } from '@/utils/constants';
const { handleResourceClick } = useLessonResource();
defineProps({
    list: {
        type: Array,
        default: () => [],
    },
});
const courseid = ref('');
onLoad((option) => {
    if (option && option.courseid) {
        courseid.value = option.courseid;
    }
});
</script>

<style scoped lang="scss">
.label-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: $uni-font-size-lg !important;
    padding: 20rpx 0;
    p {
        margin: 0;
        font-size: $uni-font-size-lg !important;
        font-weight: bold;
    }
}
.resource-container {
    padding: 20rpx 0;
    border-bottom: 1px solid $uni-border-color;
    .content {
        display: flex;
        // width: 100%;
        .icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
        }
        .right-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            color: $uni-color-title;
            font-size: $uni-font-size-m;
            flex: 1;
            .name {
                flex: 1;
            }
        }
    }
}
.description {
    //   position: relative;
    font-size: $uni-font-size-base;
    color: $uni-color-subtitle;
    margin-top: 20rpx;
    line-height: $uni-line-height;
    p {
        margin: 0 !important;
    }
    * {
        font-size: $uni-font-size-base !important;
    }
    img {
        max-width: 100% !important;
        height: auto !important;
    }
}
.disabled {
    opacity: 0.6;
}
</style>
