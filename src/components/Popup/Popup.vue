<!--
 * @Author: Lowkey
 * @Date: 2024-03-14 17:16:05
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-18 12:03:19
 * @FilePath: \BK-Portal-VUE\src\components\Popup\Popup.vue
 * @Description: Popup
-->
<template>
    <view>
        <!-- <view>
           
            <uni-popup ref="messageRef" type="message">
                <uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
            </uni-popup>
        </view> -->

        <view>
            <!-- 提示窗示例 -->
            <uni-popup ref="alertDialog" type="dialog">
                <uni-popup-dialog
                    :type="type" :confirm-text="confirmText" :title="title" :content="content" @confirm="dialogConfirm"
                    @close="dialogClose"
                ></uni-popup-dialog>
            </uni-popup>
        </view>
    </view>
</template>

<script setup name="Popup" lang="ts">


const _this = getCurrentInstance();

const props = defineProps({
    confirmText: {
        type: String,
        default: '确定'
    },
    cancelText: {
        type: String,
        default: '取消'
    },
    title:{
        type: String,
        default: '确定？'
    },
    content:{
        type: String,
        default: '(●◡●)'
    },
    onConfirm:{
        type: Function,
        default: ()=>{}
    },
    type:{
        type: String,
        default: 'info'
    }
});

const alertDialog = ref();

/**
 * @description: 删除dom节点
 * @return {*}
 */
const removePopupDom = ()=>{
    _this.appContext.config.globalProperties.$removePopup();
};
const dialogConfirm = ()=>{
    props.onConfirm();
    removePopupDom();
};
const dialogClose = ()=>{
    alertDialog.value.close();
    removePopupDom();
};

const showPopup = () =>{
    alertDialog.value.open();
};
onMounted(()=>{
    showPopup();
});
defineExpose({
    showPopup
});
</script>

