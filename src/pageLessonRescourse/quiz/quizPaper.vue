<!--
 * @Author: Lowkey
 * @Date: 2024-03-29 12:19:38
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-07 19:32:35
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\quizPaper.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar :title="useQuiz.quizData.name" :right-text="useQuiz.uiType === 'paper' ? '导航' : ''" @handle-right-click="showNavigate" />
        <ComSkeleton type="text" :loading="useQuiz.questionLoading">
            <view v-if="timeEnd > 0 && useQuiz.quizData.timelimit > 0" class="countdown">
                <text>剩余时间：</text>
                <uni-countdown
                    :font-size="18"
                    :day="limits.day"
                    :hour="limits.hour"
                    :minute="limits.minute"
                    :second="limits.second"
                    color="#FFFFFF"
                    :background-color="countdownBg"
                    @timeup="timeup"
                />
            </view>
            <QuestionBank v-if="useQuiz.uiType === 'paper'" ref="questionBankRef" />
            <QuizNavigate v-if="useQuiz.uiType === 'report'" type="report" @handle-change-navigate="handleChangeNavigate" @handle-submit="handleSubmitQuiz" />
        </ComSkeleton>
    </app-provider>
</template>

<script lang="ts" setup>
import QuestionBank from './components/QuestionBank.vue';
import QuizNavigate from './components/QuizNavigate.vue';
import { useQuizStore } from '@/store/modules/quiz';
import { Modal } from '@/utils/uniapi/prompt';
const router = useRouter();
const useQuiz = useQuizStore();
const questionBankRef = ref();
const isBack = ref(false);
const countdownBg = ref('#f3a73f');
const timeEnd = computed(() => useQuiz.getEndTime);
const remainingTime = computed({
    get: () => timeEnd.value * 1000 - new Date().getTime(),
    set: (val) => {
        remainingTime.value = val;
    },
});
const limits = computed(() => {
    const remaining = remainingTime.value;
    const totalSeconds: number = Math.round(remaining);
    const ss = 1000;
    const mi: number = ss * 60;
    const hh: number = mi * 60;
    const dd: number = hh * 24;
    const day = totalSeconds / dd;
    const hour = (totalSeconds - day * dd) / hh;
    const minute = (totalSeconds - day * dd - hour * hh) / mi;
    const second = (totalSeconds - day * dd - hour * hh - minute * mi) / ss;
    const timer = {
        day,
        hour,
        minute,
        second,
    };
    return timer;
});
const timeup = () => {
    if (useQuiz.uiType === 'paper') {
        questionBankRef.value?.onSave('finish', 'auto');
    } else {
        onSubmit();
    }
};
const showNavigate = () => {
    questionBankRef.value?.showNavigate();
};
const queryQuizQuestions = async (params: queryQuizPageParams) => {
    useQuiz.queryQuizPage(params);
};

const queryQuizNavigate = async (params: queryQuizNavigateParams) => {
    useQuiz.queryQuizNavigate(params);
};

const queryQuizPageFirstTime = async (params: queryQuizPageParams) => {
    useQuiz.queryQuizPageFirstTime(params);
};

const onSubmit = () => {
    const params = {
        attemptid: useQuiz.attemptid,
        timeup: 0,
        finishattempt: 1, // 最终提交
    };
    const callback = (data: Record<string, any>) => {
        if (data.state === 'finished') {
            // 提交后回顾结果
            router.replace({
                name: 'quizReview',
                params: {
                    attemptid: useQuiz.attemptid,
                },
            });
        }
    };
    useQuiz.saveQuiz(params, callback);
};

const handleSubmitQuiz = () => {
    // prettifyModal({
    //     title:'确定提交吗？',
    //     type:'warn',
    //     content:'测验一旦提交，答案将不可更改，请确认是否要提交。',
    //     onConfirm: ()=>onSubmit()
    // });
    Modal({
        title: '确定提交吗？',
        content: '测验一旦提交，答案将不可更改，请确认是否要提交。',
        confirmText: '确定',
        complete: function (res) {
            if (res.confirm) {
                onSubmit();
            }
        },
    });
};

const handleChangeNavigate = (page: number) => {
    const { id } = useQuiz.quizData;
    const params = {
        quizid: id,
        attemptid: useQuiz.attemptid,
        page,
    };
    useQuiz.currentPage = page;
    queryQuizQuestions(params);
    useQuiz.uiType = 'paper';
};

onLoad(async () => {
    const { id } = useQuiz.quizData;
    const answerInfo = useQuiz.getAnswerInfo;
    const { state, page, attemptid } = answerInfo;
    if (state === 'inprogress') {
        const params = {
            quizid: id,
            attemptid,
            page,
        };
        useQuiz.currentPage = page;
        queryQuizQuestions(params);
        queryQuizNavigate({ attemptid });
    } else {
        queryQuizPageFirstTime({ quizid: id });
    }
});

onUnload(() => {
    useQuiz.$reset();
});

const onBackSave = () => {
    questionBankRef.value?.onSave('goback');
    isBack.value = true;
    router.back();
};

onBackPress((options) => {
    if (options.from === 'navigateBack') {
        if (!isBack.value) {
            // prettifyModal({
            //     title:'结束本次答题？',
            //     type:'warn',
            //     content:'点击确定退出答题。',
            //     onConfirm: ()=>onBackSave()
            // });
            Modal({
                title: '结束本次答题？',
                content: '点击确定退出答题。',
                confirmText: '确定',
                complete: function (res) {
                    if (res.confirm) {
                        onBackSave();
                    }
                },
            });
            return true;
        } else {
            return false;
        }
    }
    return false;
});
</script>

<style lang="scss" scoped>
.countdown {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: $uni-container-padding;
    font-size: $uni-font-size-lg;
}
</style>
