<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-08 13:02:52
 * @FilePath: \BK-Portal-VUE\src\components\Menu\Menu.vue
 * @Description: 
-->
<template>
    <view class="grid-container">
        <uni-grid :column="column" :highlight="true" class="grid-box" :show-border="false">
            <uni-grid-item v-for="(item, index) in menuList" :key="item.id" :index="index">
                <view class="grid-item-box" style="background-color: #fff;" @click="()=>handleClick(item)">
                    <img class="icon" :src="`../../static/images/grids/${item.icon}.svg`" alt="">
                    <text class="text">{{ item.text }}</text>
                    <view class="grid-dot">
                        <slot name="dot" />
                    </view>
                </view>
            </uni-grid-item>
        </uni-grid>
    </view>
</template>

<script setup name="Nav" lang="ts">

defineProps({
    column: {
        type: Number,
        default: 5
    },
    menuList: {
        type: Array<Grids>,
        default: []
    },
    title: {
        type: String,
        default: '(●◡●)'
    },
    rightText:{
        type: String,
        default: ''
    }
});
const emit = defineEmits(['handle-grids-click']);
const handleClick = (item:Record<string,any>) =>{
    emit('handle-grids-click',item);
};
</script>


<style lang="scss" scoped>
  .grid-container {
    background: #fff;
    .grid-item-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      .icon {
        width: 28px;
        height: 28px;
      }
      .text {
        margin-top: 20rpx;
        font-size: 22rpx;
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