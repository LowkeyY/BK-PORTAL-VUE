<!--
 * @Author: Lowkey
 * @Date: 2023-09-11 11:32:00
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-29 16:21:53
 * @FilePath: \BK-Portal-VUE\src\components\PullRefreshList\PullRefreshList.vue
 * @Description:
-->

<template>
    <view class="scroll-container">
        <view v-if="!!title" class="scroll-title">
            <view class="title-left">
                <view class="title-line" />
                <view class="title-text">
                    {{ title }}
                </view>
            </view>
            <view class="title-extra">
                <slot name="extra" />
            </view>
        </view>
        <ComSkeleton :type="type==='list'?'list':'text'" :loading="loading&&!isRefresh&&showSkeleton">
            <scroll-view
                id="scroll-el"
                enable-flex="true"
                scroll-y="true"
                :style="{ height: elementHeight }"
                refresher-enabled="true"
                :refresher-triggered="triggered"
                refresher-default-style="none"
                refresher-background="transparent"
                :refresher-threshold="20"
                scroll-anchoring="true"
                @refresherpulling="onPulling"
                @refresherrefresh="onRefresh"
                @scrolltolower="loadMore"
                @refresherabort="onAbort"
                @refresherrestore="onRestore"
            >
                <view class="pull-loading">
                    <view v-if="showPullText" class="text">释放刷新</view>
                    <view v-if="pullLoading" class="img">
                        <image style="height: 60rpx; background-color: transparent;" src="@/static/svg/pullLoading.svg" />
                    </view>
                </view>
                <view v-if="type==='list'">
                    <slot v-if="listData.length&&(!loading||isRefresh)" />
                    <Empty v-else-if="!pullLoading" :loading="loading" />
                    <view v-if="hasMoreLoading" class="hasMoreImg">
                        <image style="height: 80rpx; background-color: transparent;" src="@/static/svg/pullLoading.svg" />
                    </view>
                    <view v-if="!!listData.length && !hasMore&&!hasMoreLoading" class="bottom-line">--到底了--</view>
                </view>
                <view v-else>
                    <slot v-if="!loading||isRefresh" />
                </view>
            </scroll-view>
        </ComSkeleton>
    </view>
</template>

<script setup name="PullRefreshList" lang="ts">

import { px2rpx } from '@/utils/uniapi';

const _this = getCurrentInstance();
const pullLoading = ref(false);
const showPullText = ref(false);
const elementHeight = ref('100%');
const triggered = ref(false);
const props = defineProps({
    listData: {
        type: Array,
        default: () => []
    },
    type:{
        type:String,
        default:'list'
    },
    hasMore: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: ''
    },

    loading: {
        type: Boolean,
        default: false
    },
    hasMoreLoading: {
        type: Boolean,
        default: false
    },
    showSkeleton:{
        type: Boolean,
        default: true
    },
    isRefresh:{
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['load-more', 'on-refresh']);

const loadCallBack = () => {
    triggered.value = false;
    showPullText.value = false;
    pullLoading.value = false;
};
const onPulling = () => {
    showPullText.value = true;
    // emit('on-pulling')
};
const onRefresh = () => {
    pullLoading.value = true;
    showPullText.value = false;
    triggered.value = true;
    emit('on-refresh', loadCallBack);
};
const loadMore = () => {
    if (props.hasMore) {
        emit('load-more');
    }
};
const onAbort = () => {
    triggered.value = false;
    showPullText.value = false;
    pullLoading.value = false;
};
const onRestore = () => {
    triggered.value = false;
};

const setHeight=()=>{
    // 自适应容器高度
    setTimeout(() => {
        uni.getSystemInfo({
            success: info => {
                uni.createSelectorQuery()
                    .in(_this)
                    .select('.scroll-container')
                    .boundingClientRect()
                    .exec(res => {
                        elementHeight.value = px2rpx(info.windowHeight - res[0]?.top) + 'rpx';
                    });
            }
        });
    }, 300);
};
onUpdated(()=>{
    setHeight();
});
onMounted(() => {
    setHeight();
});
</script>

<style lang="scss" scoped>
.scroll-title {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 16rpx;
  .title-left {
    display: flex;
    align-items: center;
    .title-line {
      width: 8rpx;
      height: 100%;
      margin-right: 10rpx;
      background-color: $uni-color-primary;
    }
    .title-text {
      font-size: $uni-font-size-lg;
    }
  }
}
#scroll-el {
  overflow: auto;
  min-height: 400rpx;
}
.pull-loading {
  text-align: center;
  color: $uni-text-color-placeholder;
  .text {
    margin: 20rpx;
  }
  .img {
    padding: 20rpx 0 0;
  }
}
.bottom-line {
  color: $uni-text-color-placeholder;
  padding: 20rpx 0 60rpx;
  text-align: center;
}
.hasMoreImg {
  width: 100%;
  text-align: center;
}
</style>
