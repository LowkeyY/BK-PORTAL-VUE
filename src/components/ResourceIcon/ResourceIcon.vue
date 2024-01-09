<!--
 * @Author: Lowkey
 * @Date: 2024-01-09 15:13:51
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-09 15:19:12
 * @FilePath: \BK-Portal-VUE\src\components\ResoureIcon\ResoureIcon.vue
 * @Description: 
-->

<template>
    <image
        class="icon"
        :src="`../../static/svg/${getResourceIcon(type)}`"
    />
</template>

<script lang="ts" setup name="ResourceIcon">

defineProps({
    type: {
        type: String,
        default: ''
    },
});

/**
 * @description: 课程资源图标
 * @param {*} type
 * @return {*}
 */
const getResourceIcon = (type:string):string => {
    if (type === 'assign') {
        return 'resourceIcon/homework.svg';
    } else if (type === 'quiz') {
        return 'resourceIcon/test.svg';
    } else if (type === 'forum') {
        return 'resourceIcon/huodong.svg';
    }
    return '';
};


</script>

<style lang="scss" scoped>
.icon {
  width: 40rpx;
  height: 40rpx;
}
</style>