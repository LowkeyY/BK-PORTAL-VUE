<!--
 * @Author: Lowkey
 * @Date: 2023-12-28 14:52:09
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-05 16:19:07
 * @FilePath: \BK-Portal-VUE\src\pageSub\menuManagement\index.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar title="全部菜单" />
        <view class="menu-container">
            <uni-section type="line" :title="state.title">
                <template #right>
                    <view class="extra">
                        <Link v-if="isEdit" class="save" text="保存" @click="handleSaveClick" />
                        <Link :text="state.extra" @click="handleEditClick" />
                    </view>
                </template>
            </uni-section>
            <Menu v-if="!isEdit" :menu-list="bkStudentGirds" @handle-grids-click="handleGridsClick" />
            <menu-sort v-else ref="menuSortRef" />
        </view>
    </app-provider>
</template>

<script lang="ts" setup>
import MenuSort from './components/MenuSort.vue';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/modules/user';
import { bkStudentGirds } from '@/utils/constants';
import {handleGridsClick} from '@/utils/handle';
const useApp = useAppStore();
const useUser = useUserStore();
const isEdit = ref<boolean>(false);
const menuSortRef = ref();
const state = computed(()=>{
    return {
        title:isEdit.value?'首页菜单':'全部学习菜单',
        extra:isEdit.value?'取消':'调整首页菜单',
    };
});
const handleEditClick = ()=>{
    isEdit.value =!isEdit.value;
};
const handleSaveClick = ()=>{
    const params ={
        userConfig: menuSortRef.value.sortResult,
        userId:useUser.userCode
    };
    const callback = ()=>{
        isEdit.value=false;
    };
    useApp.setGrids(params,callback);
};

</script>

<style lang="scss" scoped>
.menu-container {
  padding-top: 10px;
  .extra {
    display: flex;
    align-items: center;
    .save {
      margin-right: 20px;
    }
  }
}
</style>

