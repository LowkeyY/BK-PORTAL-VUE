<!--
 * @Author: Lowkey
 * @Date: 2024-04-30 14:18:34
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-30 15:53:47
 * @FilePath: \BK-Portal-VUE\src\pageOuchn\course\index.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar title="已选课程" />
        <view class="container">
        </view>
    </app-provider>
</template>

<script setup lang="ts">
import {queryCourseListApi} from '@/services/ouchn/list';
import {Toast} from '@/utils/uniapi/prompt';
const courseList = ref([]);
const loading = ref(false);





const queryCourseList =async () =>{
    loading.value=true;
    try {
        const {code,data,message='查询失败'}= await queryCourseListApi();
        if(code===0){
            courseList.value = data.examScoreList || [];
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

onLoad(async ()=>{
   
    queryCourseList();
  
});
</script>

<style lang="scss" scoped>

</style>
