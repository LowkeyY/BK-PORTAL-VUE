<!--
 * @Author: Lowkey
 * @Date: 2024-02-07 17:47:23
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-07 18:06:52
 * @FilePath: \BK-Portal-VUE\src\components\AttendanceState\AttendanceState.vue
 * @Description: 
-->
<template>
    <uni-tag :text="state?AttendanceEnums.NO_PASS:AttendanceEnums.PASSED" :type="state?'success':'error'" :size="size" />
</template>

<script lang="ts" setup name="AttendanceState">
import {AttendanceEnums} from '../../enums/statusEnum';
defineProps({
    state: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        default:'small'
    },
});
</script>
