<!--
 * @Author: Lowkey
 * @Date: 2024-04-01 11:40:57
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-07 19:09:34
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\components\QuestionBank.vue
 * @Description: 
-->
<template>
    <view class="content">
        <quiz-form-render ref="quizFormRef" :questions="useQuiz.getQuestions" :form-data="formData" />
        <view class="actions">
            <view v-if="useQuiz.quizData.navmethod === 'sequential'">
                <button v-if="useQuiz.paperData.nextpage > 0" :loading="useQuiz.saveLoading" type="primary" @click="() => handleChangePage()">下一题</button>
            </view>
            <view v-else>
                <button v-if="useQuiz.paperData.nextpage === 1" :loading="useQuiz.saveLoading" type="primary" @click="() => handleChangePage()">下一题</button>
                <view v-else-if="useQuiz.paperData.nextpage > 0" class="btns">
                    <view><button :loading="useQuiz.saveLoading" @click="() => handleChangePage('prev')">上一题</button></view>
                    <view>
                        <button v-if="useQuiz.paperData.nextpage > 0" :loading="useQuiz.saveLoading" type="primary" @click="() => handleChangePage()">
                            下一题
                        </button>
                        <button v-else :loading="useQuiz.saveLoading" type="primary" @click="onFinish">提交</button>
                    </view>
                </view>
                <view v-else class="btns">
                    <view><button v-if="useQuiz.currentPage > 0" :loading="useQuiz.saveLoading" @click="() => handleChangePage('prev')">上一题</button></view>
                    <view> <button :loading="useQuiz.saveLoading" type="primary" @click="onFinish">提交</button></view>
                </view>
            </view>
        </view>
        <uni-drawer ref="drawerRef" mode="right">
            <view class="scroll-view">
                <scroll-view class="scroll-view-box" scroll-y="true">
                    <QuizNavigate @handle-change-navigate="handleChangeNavigate" @handle-finish="onFinish" />
                </scroll-view>
            </view>
        </uni-drawer>
    </view>
</template>

<script setup name="QuestionBank" lang="ts">
import QuizNavigate from './QuizNavigate.vue';
import { useQuizStore } from '@/store/modules/quiz';
import { isArray } from '@/utils/is';
defineProps({
    gradeData: {
        type: Object,
        default: () => {},
    },
});
const useQuiz = useQuizStore();
const router = useRouter();
const drawerRef = ref();
const quizFormRef = ref();
const formData = computed(() => useQuiz.formData);

const showNavigate = () => {
    drawerRef.value.open();
};
const getPageItemsResponses = (questions: any[]) => {
    const responses: Record<string, any> = {};
    questions &&
        questions.map((dataItem) => {
            responses[dataItem.formulation] = dataItem.sequencecheck;
        });
    return responses;
};

const getSubmitVal = (data: Record<string, any>) => {
    const obj: Record<string, any> = {};
    Object.keys(data).forEach((key, i) => {
        obj[`data[${i}][name]`] = key;
        obj[`data[${i}][value]`] = data[key];
    });
    return obj;
};

const checkSubmitData = (obj: Record<string, any>) => {
    let target: Record<string, any> = {},
        attributes = [];
    if (obj && (attributes = Object.keys(obj)).length) {
        attributes.map((attribute) => {
            const value = obj[attribute];
            if (value !== '' && value !== null) {
                if (isArray(value)) {
                    target[attribute] = value[0];
                } else if (Object.prototype.toString.call(value) === '[object Object]') {
                    target = { ...target, ...obj[attribute] };
                } else {
                    target[attribute] = value;
                }
            }
        });
    }
    return target;
};

const saveCallback = (type: string) => {
    const { id } = useQuiz.quizData;
    if (type !== 'finish') {
        useQuiz.currentPage = type === 'next' ? useQuiz.paperData.nextpage : useQuiz.currentPage - 1;
        const params = {
            attemptid: useQuiz.attemptid,
            quizid: id,
            page: useQuiz.currentPage,
        };
        useQuiz.queryQuizPage(params);
    } else {
        // 已答完最后一题或者提前结束答题 切换答题情况报告
        // 更新导航数据并切换UI
        useQuiz.queryQuizNavigate({ attemptid: useQuiz.attemptid }, () => (useQuiz.uiType = 'report'));
    }
};
const navSaveCallback = (page: number) => {
    const { id } = useQuiz.quizData;
    const params = {
        attemptid: useQuiz.attemptid,
        quizid: id,
        page,
    };
    useQuiz.currentPage = page;
    useQuiz.queryQuizPage(params);
};

/**
 * @description:
 * @param {*} changeType 用来判断上一页、下一页、导航点击、返回提交
 * @param {*} type 是否为提交
 * @param {*} page 导航点击时传入page
 * @return {*}
 */
const onSave = (changeType: string, type = 'progress', page = 0) => {
    const { formRef } = quizFormRef.value;
    formRef.validate().then((data: Record<string, any>) => {
        const savaData = getSubmitVal({
            ...checkSubmitData(data),
            ...getPageItemsResponses(useQuiz.getQuestions),
        });
        const params = {
            ...savaData,
            attemptid: useQuiz.attemptid,
            timeup: type === 'auto' ? 1 : 0,
            finishattempt: type === 'auto' ? 1 : 0,
        };
        let callback = () => {};
        if (changeType === 'navigate') {
            callback = () => navSaveCallback(page);
        } else if (changeType !== 'goback' && type !== 'auto') {
            callback = () => saveCallback(changeType);
        } else if (type === 'auto') {
            callback = (data: Record<string, any>) => {
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
        }

        useQuiz.saveQuiz(params, callback);
    });
};

const onFinish = () => {
    onSave('finish', 'finish');
};

const handleChangePage = (changeType = 'next') => {
    onSave(changeType, 'progress');
};

const handleChangeNavigate = (page: number) => {
    onSave('navigate', 'progress', page);
};

defineExpose({
    showNavigate,
    onSave,
});
</script>

<style lang="scss" scoped>
.content {
    padding-bottom: 80rpx;
}
.actions {
    padding: 0 60rpx;
    margin: 60rpx 0 0;
    .btns {
        display: flex;
        justify-content: space-between;
    }
}
.scroll-view {
    /* #ifndef APP-NVUE */
    width: 100%;
    height: 100%;

    /* #endif */
    flex: 1;
    padding: $uni-container-padding;
    .scroll-view-box {
        flex: 1;
        position: absolute;
        inset: 0;
    }
}
</style>
