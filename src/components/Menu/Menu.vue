<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-29 19:17:10
 * @FilePath: \BK-Portal-VUE\src\components\Menu\Menu.vue
 * @Description:
-->
<template>
    <view class="grid-container">
        <uni-grid :column="column" :highlight="true" :show-border="false">
            <uni-grid-item v-for="(item, index) in menuList" :key="item.id" :index="index">
                <view class="grid-item-box" style="background-color: #fff" @click="() => handleClick(item)">
                    <image class="icon" :src="`/static/images/grids/${item.icon}.svg`" />
                    <text class="text">{{ item.text }}</text>
                    <view class="grid-dot">
                        <slot name="dot" />
                    </view>
                </view>
            </uni-grid-item>
        </uni-grid>
    </view>
</template>

<script setup name="Menu" lang="ts">
defineProps({
    column: {
        type: Number,
        default: 5,
    },
    menuList: {
        type: Array<Grids>,
        default: [
            {
                id: '1',
                icon: 'lessons',
                text: '加载中',
                path: '',
            },
        ],
    },
    title: {
        type: String,
        default: '(●◡●)',
    },
    rightText: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['handle-grids-click']);
const handleClick = (item: Record<string, any>) => {
    emit('handle-grids-click', item);
};
</script>

<style lang="scss" scoped>
.grid-container {
    background: #fff;
    .grid-item-box {
        flex: 1;
        // position: relative;

        /* #ifndef APP-NVUE */
        display: flex;

        /* #endif */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16rpx 0;
        .icon {
            width: 56rpx;
            height: 56rpx;
        }
        .text {
            margin-top: 20rpx;
            font-size: $uni-font-size-sm;
            color: $uni-text-color;
        }
        .grid-dot {
            position: absolute;
            top: 0;
            right: 8px;
        }
    }
}
</style>
