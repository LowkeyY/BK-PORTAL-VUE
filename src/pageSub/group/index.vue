<template>
    <view class="main">
        <uni-list :border="false" class="list-box">
            <uni-list-item
                v-for="group in appStore.groups" :key="group.id" clickable
                style="margin-bottom: 20rpx;"
                ellipsis="1" :title="group.course" :note="group.name" show-arrow
                @click="handleGroup(group)"
            />
        </uni-list>
    </view>
</template>

<script setup lang="ts">
import {useAppStore} from '@/store/app';
import {handleJumpToPage} from '@/utils/handle';

const appStore = useAppStore();
const handleGroup = (group) => {
    const {courseid,name}=group;
    handleJumpToPage('groupsMember',{courseid,groupName:name});
};

</script>

<style lang="scss" scoped>
.main {
  padding: $uni-container-padding;
}
.list-box {
  background-color: $uni-bg-color-grey;
}
</style>
