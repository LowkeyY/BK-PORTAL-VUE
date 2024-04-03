<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-29 12:37:01
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\index.vue
 * @Description: 
-->


<template>
    <app-provider>
        <nav-bar :title="navTitle" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="useQuiz.loading">
            <view v-if="!isEmpty(quizData)" class="content">
                <view class="title">{{ quizData['name'] }}</view>
                <uni-notice-bar v-if="quizData['_useScriptFunc']&&useApp._useJavaScriptMessage" show-close :text="useApp._useJavaScriptMessage.warn" />
                <uni-notice-bar v-if="quizData['hasquestions']===0" text="尚未添加试题" />
                <view v-if="quizData['timeopen']>0||quizData['timeclose']>0" class="time-box">
                    <view v-if="quizData['timeopen']>0" class="time">
                        <image class="icon" src="@/static/svg/assignStatus/enddate.svg" mode="widthFix"></image>
                        <text>{{ `${getLimitText(quizData['timeopen'], 'open')}：${getCommonDate(quizData['timeopen'])}` }}</text>
                    </view>
                    <view v-if="quizData['timeclose']>0" class="time">
                        <image class="icon" src="@/static/svg/assignStatus/enddate.svg" mode="widthFix"></image>
                        <text>{{ `${getLimitText(quizData['timeclose'], 'close')}：${getCommonDate(quizData['timeclose'])}` }}</text>
                    </view>
                </view>
                <expand-content max-height="400rpx">
                    <render-html :html="quizData['intro']" :courseid="queryParams?.courseid" />
                </expand-content>
                <view class="rules-box">
                    <view v-for="(item,index) in useQuiz.getRules" :key="index" class="rules">{{ item }}</view>
                    <view class="method">{{ `评分方法：${getMethod(quizData['grademethod'])}` }}</view>
                </view>
                <quiz-status-box :data="quizData['attempts']" :maxgrade="quizData['maxgrade']" :decimalpoints="quizData['decimalpoints']" :sumgrades="quizData['sumgrades']" />
                <grade-box :grade-data="quizData" />
            </view>
            <view class="aciton">
                <button v-if="quizData.visiblebutton&&!quizData.supportedMsg" type="primary" @click="handleQuizClick">{{ quizData.buttontext }}</button>
            </view>
            <uni-notice-bar
                v-if="!quizData.visiblebutton && useQuiz.getPreventNewAttemptReasons" single color="#e43d33" background-color="#fad8d6"
                :text="useQuiz.getPreventNewAttemptReasons"
            />
            <uni-notice-bar
                v-if="useQuiz.getPreventAttemptReasons" single color="#e43d33" background-color="#fad8d6"
                :text="useQuiz.getPreventAttemptReasons"
            />
            <uni-notice-bar
                v-if="quizData.supportedMsg" single color="#e43d33" background-color="#fad8d6"
                :text="quizData.supportedMsg"
            />
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import QuizStatusBox from './components/QuizStatusBox.vue';
import GradeBox from './components/GradeBox.vue';
import { useUserStore } from '@/store/modules/user';
import { useQuizStore } from '@/store/modules/quiz';
import { useSetLog } from '@/hooks/useSetLog';
import { useAppStore } from '@/store/app';
import {getCurPageParam,getCommonDate} from '@/utils';
import {prettifyModal} from '@/utils/uniapi/prompt';
import { isEmpty } from '@/utils/is';
import {handleJumpToPage} from '@/utils/handle';

const pageParams = getCurPageParam();
const { courseid,modname,instance,cmid} = pageParams;
const useUser = useUserStore();
const useApp = useAppStore();
const useQuiz = useQuizStore();
const { setLog } = useSetLog();
const { getResourceType } = useLessonResource();
const navTitle = ref('');
const quizData = computed(()=>useQuiz.quizData);
const queryParams=ref<queryQuizParams>();

const getLimitText = (date:number, type:string):string => {
    const cur = new Date().getTime() / 1000;
    if (type === 'open') {
        return cur > date ? '已开始' : '开始';
    }
    if (type === 'close') {
        return cur > date ? '已关闭' : '关闭';
    }
    return '';
};
const getMethod = (type:number):string => {
    switch (type) {
        case 1:
            return '最高分';
        case 2:
            return '平均分';
        case 3:
            return '第一次答题';
        case 4:
            return '最后一次答题';
        default:
            return '-';
    }
};
const handleRightClick = ()=>{
    console.log(23);
};

const queryQuizData = (params:queryQuizParams)=>{
    useQuiz.queryQuiz(params);
};

const goSubmitQuiz=async ()=>{
    handleJumpToPage('quizPaper');
};

const handleQuizClick = ()=>{
    if(quizData.value.timelimit>0){
        prettifyModal({
            title:'限时测验',
            content:'您一旦开始做答，系统将自动计时。您需在计时结束前提交答案，或者计时结束时系统将自动提交答案。您确定现在开始做答吗？',
            onConfirm: ()=>goSubmitQuiz()
        });
    }else{
        goSubmitQuiz();
    }
};

onPullDownRefresh(()=>{
    if(!isEmpty(queryParams.value)){
        queryQuizData(queryParams.value);
    }
});

onShow(async ()=>{
    useQuiz.$reset();
    const userid = useUser.moodleUserId;
    navTitle.value= getResourceType(modname);
    const quizParams = {
        cmid,userid,courseid,quizid:instance
    };
    queryParams.value = quizParams;
    setTimeout(()=>{
        queryQuizData(queryParams.value as queryQuizParams);
        setLog({
            cmid,
            modname,
            courseid
        });
    },0);
});
</script>
<style lang="scss" scoped>
.content {
  padding: $uni-container-padding;
  line-height: $uni-line-height;
  .title {
    font-size: $uni-font-size-lg;
    margin-bottom: 20rpx;
  }
  .time-box {
    font-size: $uni-font-size-base;
    padding: $uni-container-padding;
    background-color: #f7f7f9;
    border-radius: 10px;
    margin-bottom: 20rpx;
    .time {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      .icon {
        width: 1.2em;
        height: 1.2em;
        margin-right: 12rpx;
      }
    }
  }
  .rules-box {
    font-size: $uni-font-size-base;
    padding: $uni-container-padding;
    border: 1px solid $uni-border-color;
    border-radius: 10px;
    color: $uni-color-paragraph;
  }
}
.aciton {
  padding: 0 60rpx;
  margin: 30rpx 0;
}
</style>
