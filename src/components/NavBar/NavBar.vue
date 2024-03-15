<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-15 17:49:53
 * @FilePath: \BK-Portal-VUE\src\components\NavBar\NavBar.vue
 * @Description: 
-->
<template>
    <view class="contaner">
        <status-bar />
        <uni-nav-bar class="nav-bar" :dark="dark" color="#fff" background-color="#2b83d7" :border="false" :shadow="shadow" :title="title" left-icon="left" :right-text="rightText" @click-left="handleLeftClick" @click-right="handleRightClick">
            <template #left>
                <slot name="left"></slot>
            </template>
            <template #right>
                <slot name="right"></slot>
            </template>
        </uni-nav-bar>
        <uni-popup ref="alertDialogRef" type="dialog">
            <uni-popup-dialog
                type="info" cancel-text="取消" confirm-text="确定" title="返回？" content="返回后不会保存当前操作!" @confirm="dialogConfirm"
                @close="dialogClose"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script setup name="Nav">
const router = useRouter();
const props =defineProps({
    dark: {
        type: Boolean,
        default: false
    },
    shadow: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '(●◡●)'
    },
    rightText:{
        type: String,
        default: ''
    },
    showModal:{
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['handle-right-click']);
const alertDialogRef = ref(null);
const handleLeftClick = ()=>{
   
    if(props.showModal){
        alertDialogRef.value.open();
        return; 
    }
    router.back();
};
const handleRightClick = ()=>{
    emit('handle-right-click');
};
const dialogConfirm = ()=>{
    router.back();
};
const dialogClose = ()=>{
    alertDialogRef.value.close();
};
</script>

<style lang="scss" scoped>
.contaner {
  width: 100%;
  height: 88rpx;
  .nav-bar {
    width: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
  }
}
</style>