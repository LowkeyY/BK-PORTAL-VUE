import {defineStore} from 'pinia';
import { Toast} from '@/utils/uniapi/prompt';
import {ErrorPrompt} from '@/enums/appEnum';
import {
    queryFeedbackApi,
    queryFeedbackQuestionApi,
    responseFeedbackQuestionApi,
} from '@/services/feedback';
import {
    getItemFormInfo,
    getItemFormLabel, getItemFormMultichoice,
    getItemFormNumeric,
    getItemFormTextarea,
    getItemFormTextfield
} from '@/utils/feedback';
import {queryFeedbackParams, queryFeedbackQuestion, queryResponseFeedbackQuestion} from '@/services/model/resource';

interface FeedbackState {
    feedbackData: Record<string, any>;
    responseData: Record<string, any>;
    questions: Array<any>;
    hasnextpage: boolean;
    hasprevpage:boolean;
    loading: boolean;
    questionLoading: boolean;
    submitLoading: boolean;
    responseLoading: boolean;
}

const getQuestions = (arr:any) => {
    const result:any = [];
    arr && arr.map((item:any) => {
        switch (item.typ) {
            case 'label':
                result.push(getItemFormLabel(item));
                break;
            case 'info':
                result.push(getItemFormInfo(item));
                break;
            case 'numeric':
                result.push(getItemFormNumeric(item));
                break;
            case 'textfield':
                result.push(getItemFormTextfield(item));
                break;
            case 'textarea':
                result.push(getItemFormTextarea(item));
                break;
            case 'multichoice':
                result.push(getItemFormMultichoice(item));
                break;
            case 'multichoicerated':
                result.push(getItemFormMultichoice(item));
                break;
        }
    });
    return result;
};
export const useFeedbackStore = defineStore({
    id: 'quiz',
    state: (): FeedbackState => ({
        feedbackData: {},
        loading: false,
        questionLoading: false,
        hasnextpage:false,
        hasprevpage:false,
        submitLoading:false,
        responseLoading:false,
        questions:[],
        responseData:{}
    }),
    getters: {
    },
    actions: {
        async queryFeedback(feedbackParams: queryFeedbackParams): Promise<any> {
            try {
                this.loading = true;
                const data = await queryFeedbackApi(feedbackParams);
                if (data.success) {
                    this.feedbackData = data;
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }

            } finally {
                this.loading = false;
                uni.stopPullDownRefresh();
            }
        },
        async queryFeedbackQuestion(feedbackQuestionParams: queryFeedbackQuestion): Promise<any> {
            try {
                this.questionLoading = true;
                const data = await queryFeedbackQuestionApi(feedbackQuestionParams);
                if (data.success) {
                    const {hasnextpage,hasprevpage,items}=data;
                    this.hasnextpage=hasnextpage;
                    this.hasprevpage=hasprevpage;
                    this.questions=getQuestions(items);
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }

            } finally {
                this.questionLoading = false;
                uni.stopPullDownRefresh();
            }
        },
        async queryResponseFeedbackQuestion(feedbackQuestionParams: queryResponseFeedbackQuestion,callback?:()=>{}): Promise<any> {
            try {
                this.responseLoading = true;
                const data = await responseFeedbackQuestionApi(feedbackQuestionParams);
                if (data.success) {
                    this.responseData=data;
                    if(callback){
                        callback();
                    }
                } else {
                    Toast(data.message || ErrorPrompt.RESOURCE_ERROR);
                }

            } finally {
                this.responseLoading = false;
                if(callback){
                    callback();
                }
                uni.stopPullDownRefresh();
            }
        }
    },
});
