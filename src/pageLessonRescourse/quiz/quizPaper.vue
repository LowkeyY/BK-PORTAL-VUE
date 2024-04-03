<!--
 * @Author: Lowkey
 * @Date: 2024-03-29 12:19:38
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-03 13:33:16
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\quizPaper.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar :title="useQuiz.quizData.name" :right-text="useQuiz.uiType==='paper'?'导航':''" @handle-right-click="showNavigate" />
        <ComSkeleton type="text" :loading="useQuiz.questionLoading">
            <QuestionBank v-if="useQuiz.uiType==='paper'" ref="questionBankRef" />
            <QuizNavigate v-if="useQuiz.uiType==='report'" type="report" @handle-change-navigate="handleChangeNavigate" @handle-submit="handleSubmitQuiz" />
        </ComSkeleton>
    </app-provider>
</template>


<script lang="ts" setup>
import QuestionBank from './components/QuestionBank.vue';
import QuizNavigate from './components/QuizNavigate.vue';
import { useQuizStore } from '@/store/modules/quiz';
import {prettifyModal} from '@/utils/uniapi/prompt';

const router = useRouter();
const useQuiz = useQuizStore();
const questionBankRef = ref();
const isBack=ref(false);

const showNavigate = ()=>{
    questionBankRef.value?.showNavigate();
};
const queryQuizQuestions = async(params:queryQuizPageParams)=>{
    useQuiz.queryQuizPage(params);
};

const queryQuizNavigate = async(params:queryQuizNavigateParams)=>{
    useQuiz.queryQuizNavigate(params);
};

const queryQuizPageFirstTime = async(params:queryQuizPageParams)=>{
    useQuiz.queryQuizPageFirstTime(params);
};

const onSubmit = ()=>{
    const answerInfo = useQuiz.getAnswerInfo;
    const {attemptid} = answerInfo;
    const params = {
        attemptid,
        timeup: 0, // 不知道1、0 的区别
        finishattempt: 1 // 最终提交
    };
    const callback = (data)=>{
        if(data.state === 'finished'){
            // 提交后回顾结果
        }
    };
    useQuiz.saveQuiz(params);
};

const handleSubmitQuiz = ()=>{
    prettifyModal({
        title:'确定提交吗？',
        type:'warn',
        content:'测验一旦提交，答案将不可更改，请确认是否要提交。',
        onConfirm: ()=>onSubmit()
    });
};

const handleChangeNavigate=(page:number)=>{
    const {id} = useQuiz.quizData;
    const answerInfo = useQuiz.getAnswerInfo;
    const {attemptid} = answerInfo;
    const params = {
        quizid:id,
        attemptid,
        page
    };
    useQuiz.currentPage=page;
    queryQuizQuestions(params);
    useQuiz.uiType='paper';
};

onLoad(async()=> {
    const {id} = useQuiz.quizData;
    const answerInfo = useQuiz.getAnswerInfo;
    const {state,page,attemptid} = answerInfo;

    if(state==='inprogress'){
        const params = {
            quizid:id,
            attemptid,
            page
        };
        useQuiz.currentPage=page;
        queryQuizQuestions(params);
        queryQuizNavigate({attemptid});
    }else{
        queryQuizPageFirstTime({quizid:id});
    }
});

const onBackSave =()=>{
    questionBankRef.value?.onSave('goback');
    isBack.value=true;
    router.back();
};

onBackPress((options)=>{
    if (options.from === 'navigateBack') {

        if(!isBack.value){
            prettifyModal({
                title:'结束本次答题？',
                type:'warn',
                content:'点击确定退出答题。',
                onConfirm: ()=>onBackSave()
            });
            return true;
        }else{
            return  false;
        }
      
    }
    return false;
});
</script>


<style lang="scss" scoped>

</style>