/*
 * @Author: Lowkey
 * @Date: 2024-03-26 17:58:12
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-13 12:09:16
 * @FilePath: \BK-Portal-VUE\src\store\modules\quiz.ts
 * @Description:
 */
/* eslint-disable no-useless-catch */

import { defineStore } from 'pinia';
import { Toast, Modal } from '@/utils/uniapi/prompt';
import { queryQuizApi, queryQuizPageFirstTimeApi, queryQuizReviewApi, queryQuizPageApi, queryQuizNavigateApi, saveQuizApi } from '@/services/quiz';
import {
    getQuizInfo,
    choiceQuestion,
    matchQuestion,
    getTimes,
    shortanswerQusetion,
    essayQusetion,
    multianswerQusetion,
    gapselectQusetion,
} from '@/utils/analysis';
import { ErrorPrompt } from '@/enums/appEnum';
import { isArray } from '@/utils/is';
import { router } from '@/router';

interface QuizState {
    quizData: Record<string, any>;
    paperData: Record<string, any>;
    reviewData: Record<string, any>;
    formData: Record<string, any>;
    navigate: any[];
    questions: any[];
    uiType: string;
    currentPage: number;
    loading: boolean;
    questionLoading: boolean;
    saveLoading: boolean;
    reviewLoading: boolean;
    attemptid: string;
}
interface QuizDataTmp {
    name: string;
    html: any;
    type: string;
    choose?: any;
    info: any;
    formulation: any;
    sequencecheck: any;
    slot: number;
}
const formatData = (data: any[], formData: Record<string, any>) => {
    const res: any[] = [];
    data.map((item: QuizDataTmp) => {
        const obj: Record<string, any> = {};
        if (item.type === 'multichoice' || item.type === 'truefalse' || item.type === 'multichoiceset') {
            // 单选 判断 多选
            obj.options = choiceQuestion(item.html);
            if (isArray(obj.options) && obj.options.length) {
                let value;
                let name;
                const isCheckbox = obj.options.find((item) => item.type === 'checkbox');
                if (isCheckbox) {
                    // 多选设置value 为对象
                    name = `${item.type}_${item.slot}`; // 多选name
                    const valueObj: Record<string, boolean> = {};
                    obj.options.forEach((item) => {
                        valueObj[item.name] = item.selected;
                    });
                    value = valueObj;
                } else {
                    name = obj.options[0].name;
                    value = obj.options.find((item) => item.selected)?.value || '';
                }
                formData[name] = value;
                obj.name = name;
            }
        } else if (item.type === 'essay') {
            obj.config = essayQusetion(item.html);
            obj.name = obj.config.name;
            formData[obj.name] = obj.config.value;
        } else if (item.type === 'match') {
            obj.questions = matchQuestion(item.html);
            obj.questions.forEach((question: Record<string, any>) => {
                formData[question.name] = question.options.find((option: Record<string, any>) => option.selected === true)?.value || '';
            });
        } else if (item.type === 'shortanswer') {
            obj.config = shortanswerQusetion(item.html);
            obj.name = obj.config.name;
            formData[obj.name] = obj.config.value;
        } else if (item.type === 'multianswer') {
            const config = multianswerQusetion(item.html);
            obj.question = config.question;
            obj.forms = config.forms;
            obj.forms.forEach((question: Record<string, any>) => {
                formData[question.name] = question.value || '';
            });
        } else if (item.type === 'gapselect') {
            const config = gapselectQusetion(item.html);
            obj.forms = config.forms;
            config.forms.forEach((question: Record<string, any>) => {
                formData[question.name] = question.options.find((option: Record<string, any>) => option.selected === true)?.value || '';
            });
        }
        obj.info = getQuizInfo(item.html, item.type);
        obj.formulation = getTimes(item.html);
        obj.type = item.type;
        obj.sequencecheck = item.sequencecheck;
        res.push(obj);
    });
    return res;
};
export const useQuizStore = defineStore({
    id: 'quiz',
    state: (): QuizState => ({
        quizData: {},
        paperData: {},
        reviewData: {},
        navigate: [],
        questions: [],
        uiType: 'paper', // paper显示答题  report显示答题情况
        formData: {}, // 选择数据
        currentPage: 0,
        loading: false,
        questionLoading: false,
        saveLoading: false,
        reviewLoading: false,
        attemptid: '',
    }),
    getters: {
        /**
         * @description: 获取测验配置
         * @param {*} state
         * @return {*}
         */
        getRules: (state) => {
            const { quizData } = state;
            const { options = {} } = quizData;
            return options.accessrules;
        },
        getPreventAttemptReasons: (state) => {
            const { quizData } = state;
            const { options = {} } = quizData;
            if (isArray(options.preventaccessreasons) && options.preventaccessreasons.length) {
                return options.preventaccessreasons[0];
            }
            return null;
        },
        getPreventNewAttemptReasons: (state) => {
            const { quizData } = state;
            const { preventnewattemptreasons = [] } = quizData;
            if (preventnewattemptreasons.length) {
                return preventnewattemptreasons[0];
            }
            return null;
        },
        getAnswerInfo: (state) => {
            const { quizData } = state;
            const { attempts = [] } = quizData;
            const res: Record<string, any> = {};
            if (isArray(attempts) && attempts.length > 0) {
                const obj = attempts[attempts.length - 1];
                res.state = obj.state;
                res.attemptid = obj.id;
                res.page = obj.currentpage;
            }
            return res;
        },
        getQuestions: (state) => {
            const { paperData, formData } = state;
            const { questions = [] } = paperData;
            return formatData(questions, formData);
        },
        getReviewQuestions: (state) => {
            const { reviewData, formData } = state;
            const { questions = [] } = reviewData;
            return formatData(questions, formData);
        },
        getEndTime: (state) => {
            const { paperData } = state;
            const { options = {} } = paperData;
            return options.endtime;
        },
    },
    actions: {
        async queryQuiz(quizParams: queryQuizParams): Promise<any> {
            try {
                this.loading = true;
                const data = await queryQuizApi(quizParams);
                if (data.success) {
                    this.quizData = data;
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }
            } catch (err) {
                throw err;
            } finally {
                this.loading = false;
                uni.stopPullDownRefresh();
            }
        },
        async queryQuizPage(params: queryQuizPageParams): Promise<any> {
            try {
                this.questionLoading = true;
                const data = await queryQuizPageApi(params);
                if (data.success) {
                    this.paperData = data;
                    this.attemptid = data.attempt.id;
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                    if (data.errorcode === 'attemptalreadyclosed') {
                        router.back();
                    }
                }
            } catch (err) {
                throw err;
            } finally {
                this.questionLoading = false;
            }
        },
        async queryQuizNavigate(params: queryQuizNavigateParams, callback?: Function): Promise<any> {
            try {
                const data = await queryQuizNavigateApi(params);
                if (data.success) {
                    this.navigate = data.questions;
                    callback && callback();
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }
            } catch (err) {
                throw err;
            }
        },
        async queryQuizPageFirstTime(params: queryQuizPageParams): Promise<any> {
            try {
                const data = await queryQuizPageFirstTimeApi(params);
                if (data.success) {
                    this.paperData = data;
                    this.queryQuizNavigate({ attemptid: data.id });
                    this.attemptid = data.id;
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }
            } catch (err) {
                throw err;
            }
        },
        async saveQuiz(assignParams: saveQuizParams, callback?: Function): Promise<any> {
            try {
                this.saveLoading = true;
                const data = await saveQuizApi(assignParams);
                if (data.success) {
                    callback && callback(data);
                } else {
                    if (data.modalAlert) {
                        // prettifyModal({
                        //     title:'提交失败',
                        //     content:`${data.message || '提交失败,请稍后再试'}`,
                        // });
                        Modal({
                            title: '提交失败',
                            content: `${data.message || '提交失败,请稍后再试'}`,
                            confirmText: '确定',
                        });
                    } else {
                        Toast(data.message || '提交失败,请稍后再试');
                    }
                }
            } catch (err) {
                throw err;
            } finally {
                this.saveLoading = false;
            }
        },
        async queryQuizReview(params: queryQuizReviewParams): Promise<any> {
            try {
                this.reviewLoading = true;
                const data = await queryQuizReviewApi(params);
                if (data.success) {
                    this.reviewData = data;
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }
            } catch (err) {
                throw err;
            } finally {
                this.reviewLoading = false;
            }
        },
    },
});
