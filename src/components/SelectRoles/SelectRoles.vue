<template>
    <uni-popup ref="popupRef" background-color="#fff">
        <view class="popup-content">
            <view class="action-item border" @click="handelSelect('bjou_student')">北开学生</view>
            <view class="action-item border" @click="handelSelect('ouchn_student')">国开学生</view>
            <view class="action-item cancel" @click="popupRef.close()">取消</view>
        </view>
    </uni-popup>
</template>

<script setup lang="ts" name="SelectRoles">
const emit = defineEmits(['selectRole']);
const popupRef = ref();

const handelSelect = (role) => {
    emit('selectRole', role);
    popupRef.value.close();
};
const toggle = () => {
    popupRef.value.open('bottom');
};
defineExpose({
    toggle,
});
</script>

<style scoped lang="scss">
.popup-content {
    .action-item {
        font-size: $uni-font-size-lg;
        color: $uni-color-title;
        padding: 30rpx 0;
    }
    .border {
        border-bottom: 1px solid $uni-border-color;
    }
    .cancel {
        color: #ca3120;
    }
}
</style>
