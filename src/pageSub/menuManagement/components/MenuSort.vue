<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-02 17:42:30
 * @FilePath: \BK-Portal-VUE\src\pageSub\menuManagement\components\MenuSort.vue
 * @Description: 
-->
<template>
    <view class="menu-container">
        <view class="tips">可以将常用的学习菜单添加到首页，拖动可调整菜单顺序</view>
        <drag-menu :list="homeGrids" :column="5" :aspect-ratio="1" after ghost longpress @change="handleSortchange" @handle-click="handleRemoveClick">
            <template #grid="{oindex, content, active}">
                <view class="grid">
                    <img class="icon" :src="`../../static/images/grids/${content.icon}.svg`" alt="">
                    <text class="text">{{ content.text }}</text>
                    <view class="grid-dot">
                        <uni-icons type="minus-filled" color="#c0c0c0"></uni-icons>
                    </view>
                </view>
            </template>
        </drag-menu> 
        <uni-section type="line" title="更多菜单" />
        <Menu :menu-list="filterGrids" @handle-grids-click="handleAddClick">
            <template #dot>
                <uni-icons type="plus-filled" color="#2b83d7"></uni-icons>
            </template>
        </Menu>
    </view>
</template>

<script lang="ts" setup name="MenuSort">
import DragMenu from './DragMenu.vue';
import { bkStudentGirds } from '@/utils/constants';
import { useAppStore } from '@/store/app';
import { Toast } from '@/utils/uniapi/prompt';
const useApp = useAppStore();
const sortArr = ref(useApp.gridsSort.split(',')); // 排序数组
const sortResult = ref(useApp.gridsSort);

// 首页菜单过滤“更多”
const homeGrids = computed(()=>{
    const arr: any[] = [];
    sortArr.value.map((item:string) => {
        arr.push(
            bkStudentGirds.find(ev => ev.id === item)
        );
    });
    return arr;
});
// 未显示在首页的菜单
const filterGrids = computed(()=>{
    return  bkStudentGirds.filter(item=>!sortArr.value.includes(item.id));
});

const handleSortchange =(v:any )=> {
    sortResult.value = v.map((item:Record<string,any>)=>item.content.id).join(',');
};
const handleAddClick = (item:any)=>{
    sortArr.value = [...sortArr.value,item.id];
    sortResult.value=sortArr.value.join(',');
};
const handleRemoveClick = (item:any)=>{
    const {content:{id}}  = item;
    if(sortArr.value.length<2){
        Toast('请至少保留一个菜单');
        return;
    }
    sortArr.value=sortArr.value.filter(item=>item!==id);
    sortResult.value=sortArr.value.join(',');
};
defineExpose({
    sortResult
});
</script>

<style lang="scss" scoped>
.menu-container {
  padding-top: 10px;
  .tips {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-placeholder;
    text-align: center;
    margin-bottom: 20px;
  }
  .grid {
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
      top: -5px;
      right: 8px;
    }
  }
}
</style>