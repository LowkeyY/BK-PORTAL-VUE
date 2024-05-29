<!--
 * @Author: Lowkey
 * @Date: 2024-05-23 18:15:13
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-28 11:38:16
 * @FilePath: \BK-Portal-VUE\src\components\GroupSelect\GroupSelect.vue
 * @Description: 
-->
<template>
    <view class="container">
        <uni-data-picker v-model="groupValue" placeholder="选择小组" popup-title="小组" :localdata="useLesson.getLessonGroups" @change="onchange" />
    </view>
</template>

<script setup name="GroupSelect">
import { getCurPageParam } from '@/utils';
import { useLessonStore } from '@/store/modules/lesson';
defineProps({
    courseid: {
        type: String,
        default: '没有数据!',
    },
});
const pageParams = getCurPageParam();
const { courseid } = pageParams;
const useLesson = useLessonStore();
const groupValue = ref('');
const onchange = (e) => {
    console.log(e);
};
onBeforeMount(async () => {
    if (courseid) {
        await useLesson.queryCourseContent({ courseid });
    }
});
</script>

<style scoped lang="scss">
.container {
    padding: $uni-container-padding;
    background-color: #fff;
    margin-bottom: $uni-spacing-col-base;
}
</style>
