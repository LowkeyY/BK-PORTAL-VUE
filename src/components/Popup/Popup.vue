<!--
 * @Author: Lowkey
 * @Date: 2024-03-14 17:16:05
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-19 13:20:33
 * @FilePath: \BK-Portal-VUE\src\components\Popup\Popup.vue
 * @Description: Popup
-->
<template>
    <view>
        <view v-if="modalType==='message'">
            <uni-popup ref="messageRef" type="message" @change="change">
                <uni-popup-message :type="type" :message="content"></uni-popup-message>
            </uni-popup>
        </view>
        <view v-else>
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
    onCancel:{
        type: Function,
        default: ()=>{}
    },
    type:{
        type: String,
        default: 'info'
    },
    modalType:{
        type: String,
        default: 'dialog'
    }
});

const alertDialog = ref();
const messageRef =ref();
const change= (e:Record<string,any>)=>{
    if(!e.show){
        removePopupDom();
    }
};
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
    props.onCancel();
    removePopupDom();
};

const showPopup = () =>{
    if(props.modalType==='dialog'){
        alertDialog.value.open();
    }else{
        messageRef.value.open();
    }
   
};
onMounted(()=>{
    showPopup();
});
defineExpose({
    showPopup
});
</script>

