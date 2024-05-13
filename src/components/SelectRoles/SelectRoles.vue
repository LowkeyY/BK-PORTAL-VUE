<!--
 * @Author: Lowkey
 * @Date: 2024-04-29 16:43:58
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-30 12:22:05
 * @FilePath: \BK-Portal-VUE\src\components\SelectRoles\SelectRoles.vue
 * @Description:
-->

<template>
    <uni-popup ref="popupRef" background-color="#fff">
        <view class="popup-content">
            <view v-for="role in userUser.roleList" :key="role.orgCode" class="action-item border" @click="handelSelect(role.orgCode)">{{ role.orgName }}</view>
            <view class="action-item cancel" @click="popupRef.close()">取消</view>
        </view>
    </uni-popup>
</template>

<script setup lang="ts" name="SelectRoles">
import { useUserStore } from '@/store/modules/user';
const emit = defineEmits(['selectRole']);
const popupRef = ref();
const userUser = useUserStore();
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
  width: 700rpx;
  .action-item {
    text-align: center;
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
