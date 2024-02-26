<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-26 17:25:06
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\webPage\index.vue
 * @Description: 
-->


<template>
    <app-provider>
        <nav-bar :title="title" right-text="资源反馈" @handle-right-click="handleRightClick" />
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
const { getResourceType } = useLessonResource();
const title = ref('');
const handleRightClick = ()=>{
    console.log(23);
};
onLoad(async (options) => {
    if (options) {
        const { courseid,modname} = options;
        title.value= getResourceType(modname);
    }
});
</script>
<style lang="scss" scoped></style>
