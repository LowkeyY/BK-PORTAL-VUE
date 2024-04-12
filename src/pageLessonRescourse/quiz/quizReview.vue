<!--
 * @Author: Lowkey
 * @Date: 2024-04-03 13:31:59
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-12 17:48:24
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\quizReview.vue
 * @Description: 
-->


<template>
    <app-provider>
        <nav-bar title="回顾测验" />
        <ComSkeleton type="text" :loading="useQuiz.reviewLoading">
            <uni-list>
                <uni-list-item title="作答时间" :right-text="reviewinfo.timestart ? getCommonDate(reviewinfo.timestart) : '-'" />
                <uni-list-item title="状态" :right-text="reviewinfo.state === 'finished'?'完成':'-'" />
                <uni-list-item title="完成于" :right-text="getCommonDate(reviewinfo.timefinish)" />
                <uni-list-item title="耗时" :right-text="getDurationTime(reviewinfo.timestart,reviewinfo.timefinish)" />
                <uni-list-item title="成绩" :right-text="getGrade" />
            </uni-list>
            <view v-if="additionaldata">
                <uni-section :title="additionaldata.title" type="line" />
                <render-html :html="additionaldata.content" space /> 
            </view>
            <quiz-form-render :questions="useQuiz.getReviewQuestions" :form-data="formData" />
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import { useQuizStore } from '@/store/modules/quiz';
import {getCommonDate,getDurationTime} from '@/utils';
const useQuiz = useQuizStore();
const reviewinfo = computed(()=>useQuiz.reviewData.attempt);
const getGrade = computed(()=>{
    const {grade,decimalpoints=1} = useQuiz.reviewData;
    const multiplier = Math.pow(10, decimalpoints);
    return Math.round(grade * multiplier) / multiplier;
});
const additionaldata = computed(()=>{
    const {additionaldata=[]} = useQuiz.reviewData;
    if(additionaldata.length>0){
        return {
            title:additionaldata[0].title || '反馈',
            content:additionaldata[0].content
        };
    }else{
        return null;
    }
});
const formData = computed(()=>useQuiz.formData);
onLoad(async(options)=> {
    if(options){
        const {attemptid} = options;
        useQuiz.queryQuizReview({attemptid});
    }
});
</script>
<style lang="scss" scoped></style>
