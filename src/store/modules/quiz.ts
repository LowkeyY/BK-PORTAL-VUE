/*
 * @Author: Lowkey
 * @Date: 2024-03-26 17:58:12
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-03 16:09:09
 * @FilePath: \BK-Portal-VUE\src\store\modules\quiz.ts
 * @Description: 
 */
/* eslint-disable no-useless-catch */

import {defineStore} from 'pinia';
import {Toast,prettifyModal} from '@/utils/uniapi/prompt';
import {queryQuizApi,queryQuizPageFirstTimeApi,queryQuizReviewApi,queryQuizPageApi,queryQuizNavigateApi,saveQuizApi} from '@/services/quiz';
import { getQuizText,getQuizInfo,choiceQuestion,matchQuestion, getTimes, shortanswerQusetion, essayQusetion} from '@/utils/analysis';
import {ErrorPrompt} from '@/enums/appEnum';
import {isArray} from '@/utils/is';
import { router } from '@/router';

interface UserState {
    quizData: Record<string,any>;
    paperData: Record<string,any>;
    reviewData: Record<string,any>; 
    formData: Record<string,any>; 
    navigate: any[];
    questions: any[];
    uiType:string;
    currentPage:number;
    loading:boolean;
    questionLoading:boolean;
    saveLoading:boolean;
    reviewLoading:boolean;
}
const formatData = (data:any[],formData:Record<string,any>)=>{
    const res:any[] = [];
    data.map((item: { html: any; type: string; choose: any; info: any; formulation: any;sequencecheck:any }) => {
        const obj:Record<string,any> = {};
        obj.html = getQuizText(item.html);
        if (item.type === 'multichoice' || item.type === 'truefalse' || item.type === 'multichoiceset') {
            // 单选 判断 多选
            obj.choose = choiceQuestion(item.html);
            if(isArray(choiceQuestion(item.html))&&choiceQuestion(item.html).length){
                const {name}=choiceQuestion(item.html)[0];
                const value =choiceQuestion(item.html).find(item=>item.checked)?.value||null;
                formData[name]=value; 
                obj.name=name;
            }
        } else if (item.type === 'essay') {
            obj.choose = essayQusetion(item.html);
        } else if (item.type === 'match') {
            obj.choose = matchQuestion(item.html);
        } else if (item.type === 'shortanswer') {
            obj.choose = shortanswerQusetion(item.html);
        }
        obj.info = getQuizInfo(item.html, item.type);
        obj.formulation = getTimes(item.html);
        obj.type=item.type;
        obj.sequencecheck=item.sequencecheck;
        res.push(obj);
    });
    console.log(res);
    return res;
};
export const useQuizStore = defineStore({
    id: 'quiz',
    state: (): UserState => ({
        quizData:{},
        paperData:{},
        reviewData:{},
        navigate:[],
        questions:[],
        uiType:'paper', // paper显示答题  report显示答题情况
        formData:{}, // 选择数据
        currentPage:0,
        loading:false,
        questionLoading:false,
        saveLoading:false,
        reviewLoading:false,
    }),
    getters: {
        /**
         * @description: 获取测验配置
         * @param {*} state
         * @return {*}
         */        
        getRules:(state)=>{
            const {quizData} =state;
            const {options={}} = quizData;
            return options.accessrules;
        },
        getPreventAttemptReasons:(state)=>{
            const {quizData} =state;
            const {options={}} = quizData;
            if(isArray(options.preventaccessreasons)&&options.preventaccessreasons.length){
                return options.preventaccessreasons[0];
            }
            return null;
        },
        getPreventNewAttemptReasons:(state)=>{
            const {quizData} =state;
            const {preventnewattemptreasons=[]} = quizData;
            if(preventnewattemptreasons.length){
                return preventnewattemptreasons[0];
            }
            return null;
        },
        getAnswerInfo: (state) => {
            const {quizData} =state;
            const {attempts=[]} = quizData;
            const res:Record<string,any> = {};
            if (isArray(attempts) && attempts.length > 0) {
                const obj = attempts[attempts.length - 1];
                res.state = obj.state;
                res.attemptid = obj.id;
                res.page = obj.currentpage;
            }
            return res;
        },
        getQuestions:(state)=>{
            const {paperData,formData} =state;
            const {questions=[]} = paperData;
            return formatData(questions,formData);
        },
        getReviewQuestions:(state)=>{
            const {reviewData,formData} =state;
            const {questions=[]} = reviewData;
            return formatData(questions,formData);
        }
    },
    actions: {
        async queryQuiz(quizParams:queryQuizParams): Promise<any> {
            try{
                this.loading= true;
                const data = await queryQuizApi(quizParams);
                if(data.success){
                    this.quizData = data;
                }else{
                    Toast(data.message||ErrorPrompt.RESOURCE_ERROR);
                }
                  
            }catch(err){
                throw err;
            }finally{   
                this.loading= false;
                uni.stopPullDownRefresh();
            }
        },
        async queryQuizPage(params:queryQuizPageParams): Promise<any> {
            try{
                this.questionLoading= true;
                const data = await queryQuizPageApi(params);
                if(data.success){
                    this.paperData = data;
                }else{
                    Toast(data.message||ErrorPrompt.RESOURCE_ERROR);
                    if (data.errorcode === 'attemptalreadyclosed') {
                        router.back();
                    }
                   
                }      
            }catch(err){
                throw err;
            }finally{   
                this.questionLoading= false;
            }
        },
        async queryQuizNavigate(params:queryQuizNavigateParams,callback?:Function): Promise<any> {
            try{
                const data = await queryQuizNavigateApi(params);
                if(data.success){
                    this.navigate = data.questions;
                    callback&&callback();
                }else{
                    Toast(data.message||ErrorPrompt.RESOURCE_ERROR); 
                }      
            }catch(err){
                throw err;
            }
        },
        async queryQuizPageFirstTime(params:queryQuizPageParams): Promise<any> {
            try{
                const data = await queryQuizPageFirstTimeApi(params);
                if(data.success){
                    this.paperData = data;
                    this.queryQuizNavigate({attemptid:data.id});
                }else{
                    Toast(data.message||ErrorPrompt.RESOURCE_ERROR); 
                }      
            }catch(err){
                throw err;
            }
        },
        async saveQuiz(assignParams:saveQuizParams,callback?:Function): Promise<any> {
           
            try{
                this.saveLoading= true;
                const data = await saveQuizApi(assignParams);
                if(data.success){
                    callback&&callback(data);
                }else{
                    if (data.modalAlert) {
                        prettifyModal({
                            title:'提交失败',
                            content:`${data.message || '提交失败,请稍后再试'}`,
                        });
                    } else {
                        Toast(data.message || '提交失败,请稍后再试');
                    }
                   
                }
            }catch(err){
                throw err;
            }finally{   
                this.saveLoading= false;
            }
        },
        async queryQuizReview(params:queryQuizReviewParams): Promise<any> {
            try{
                this.reviewLoading=true;
                const data = await queryQuizReviewApi(params);
                if(data.success){
                    this.reviewData=data;
                }else{
                    Toast(data.message||ErrorPrompt.RESOURCE_ERROR); 
                }      
            }catch(err){
                throw err;
            }finally{
                this.reviewLoading=false;
            }
        },
    }
});
