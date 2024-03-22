<!--
 * @Author: Lowkey
 * @Date: 2024-02-07 14:00:41
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-22 16:33:02
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\StatusIcon.vue
 * @Description: 
-->
<template>
    <view>
        <view v-if="tracking===ResourceTracking.MANUAL" @click="handleClick">
            <loading-icon v-if="loading" :loading="true" type="inline" />
            <image v-else class="img" :src="getIcon(state,tracking)" mode="widthFix" />
        </view>
        <view v-if="tracking===ResourceTracking.AUTO">
            <image class="img" :src="getIcon(state,tracking)" mode="widthFix" />
        </view>
    </view>
</template>

<script setup name="ResourceList" lang="ts">
import { useLessonStore } from '@/store/modules/lesson';
import {ResourceTracking} from '@/enums/statusEnum';
import { completionApi} from '@/services/lesson';
import {getCurPageParam} from '@/utils';
import { Toast } from '@/utils/uniapi/prompt';
const props = defineProps({
    id: {
        type: [Number,String],
        default: 7527
    },
    state: {
        type: String,
        default: '1'
    },
    tracking: {
        type: String,
        default: '1'
    },
});
const {courseid} = getCurPageParam();
const useLesson = useLessonStore();
const loading = ref(false);
const getIcon = (state:any, tracking:string) => {
    const PATH = '/static/svg/resourceStatus';
    const newState = parseInt(state, 10);
    if (tracking === '2') {
        if (newState === 1) {
            return `${PATH}/completion-auto-pass.svg`;
        } else if (newState === 2) {
            return `${PATH}/completion-auto-pass.svg`;
        } else if (newState === 3) {
            return `${PATH}/completion-auto-fail.svg`;
        }
        return `${PATH}/completion-auto-n.svg`;
    } else {
        if (newState === 1) {
            return `${PATH}/completion-manual-y.svg`;
        } else if (newState === 2) {
            return `${PATH}/completion-manual-y.svg`;
        } else if (newState === 3) {
            return `${PATH}/completion-auto-fail.svg`;
        }
        return `${PATH}/completion-manual-n.svg`;
    }
};


const handleClick =async (e:MouseEvent) =>{
    e.stopPropagation();
    const completed = parseInt(props.state, 10) === 0 ? '1' : '0';
    try {
        loading.value=true;
        const {success,message='手动标记资源状态失败！'} = await completionApi({cmid:props.id,completed});
        if(success){
            await useLesson.queryCourseContent({ courseid },true);
        }else{
            Toast(message);
        }
        // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }finally{
        loading.value=false;
    }
};
</script>

<style scoped lang="scss">
  .img {
    width: 40rpx;
  }
</style>