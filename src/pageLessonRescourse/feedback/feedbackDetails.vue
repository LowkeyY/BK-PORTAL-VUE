<template>
    <app-provider>
        <nav-bar title="答题" :use-left-click="true" @handle-left-click="handleBack" />
        <ComSkeleton type="text" :loading="useFeedback.questionLoading">
            <uni-section title="模式" type="line">
                <view class="container">
                    {{ curFeedback.anonymous === 1 ? '匿名方式' : '实名方式' }}
                </view>
            </uni-section>
            <uni-forms ref="formRef" :rules="formRules" :model-value="submitDate" label-position="top">
                <uni-forms-item v-for="(question) in curQuestions" ref="dynamicForm" :key="question.id" class="item" :name="`${question.typ}_${question.id}`">
                    <template #label>
                        <view v-show="question.typ!=='label'" class="title">
                            <text v-if="question.required" class="required">*</text>
                            <text>
                                {{ question.typ==='numeric'?
                                    `${question.name}(${question.presentation.split('|')[0] !== '' ? question.presentation.split('|')[0] * 1 : -1}~${question.presentation.split('|')[1] !== '' ? question.presentation.split('|')[1] * 1 : -1})` :question.name }}
                            </text>
                        </view>
                    </template>
                    <view class="item-context">
                        <view v-if="question.typ==='info'">
                            {{ question.otherdata }}
                        </view>
                        <view v-if="question.typ==='textfield'">
                            <uni-easyinput
                                v-model="submitDate[`${question.typ}_${question.id}`]" placeholder="请输入" :styles="styles"
                                :max-length="question.presentation.split('|')[1]"
                            ></uni-easyinput>
                        </view>
                        <view v-if="question.typ==='textarea'">
                            <uni-easyinput v-model="submitDate[`${question.typ}_${question.id}`]" :styles="styles" type="textarea" placeholder="在此输入答案"></uni-easyinput>
                        </view>
                        <view v-if="question.typ==='numeric'">
                            <uni-easyinput
                                v-model="submitDate[`${question.typ}_${question.id}`]" type="number" :styles="styles"
                                placeholder="请回答"
                            ></uni-easyinput>
                        </view>
                        <view v-if="question.typ==='label'">
                            <render-html :html="question.presentation" />
                        </view>
                        <view v-if="question.typ==='multichoice'||question.typ==='multichoicerated'">
                            <uni-data-checkbox
                                v-if="question.template === 'multichoice-c'"
                                v-model="submitDate[`${question.typ}_${question.id}`]" multiple :localdata="question.choices"
                            />
                            <uni-data-picker
                                v-if="question.template === 'multichoice-d'" v-model="submitDate[`${question.typ}_${question.id}`]"
                                placeholder="请选择" popup-title="请选择" :localdata="question.choices"
                            >
                            </uni-data-picker>
                            <uni-data-checkbox v-if="question.template === 'multichoice-r'" v-model="submitDate[`${question.typ}_${question.id}`]" :localdata="question.choices" />
                        </view>
                    </view>
                </uni-forms-item>
            </uni-forms>
            <button v-if="curHasprevpage" :loading="preLoading" style="margin-bottom: 20rpx" @click="handlerPrevClick">上一页</button>
            <button v-if="curNasnextpage&&submitLoading" :loading="nextLoading" style="margin-bottom: 20rpx" type="primary" @click="handlerNextClick">下一页</button>
            <button :loading="submitLoading" style="margin-bottom: 20rpx" type="primary" @click="handleSubmit">提交</button>
        </ComSkeleton>
        <uni-popup ref="alertDialogRef" type="dialog">
            <uni-popup-dialog
                type="warn" cancel-text="取消" confirm-text="提交" title="提交" content="确定要提交吗???"
                @confirm="confirmSubmit"
            ></uni-popup-dialog>
        </uni-popup>
        <uni-popup ref="backDialogRef" type="dialog">
            <uni-popup-dialog
                type="info" cancel-text="取消" confirm-text="确定" title="结束本次答题？" content="离开后不保存当前答案"
                @confirm="router.back()"
            ></uni-popup-dialog>
        </uni-popup>
    </app-provider>
</template>

<script setup lang="ts">
import {getCurPageParam} from '@/utils';
import {useFeedbackStore} from '@/store/modules/feedback';
import {Toast} from '@/utils/uniapi/prompt';
import {isArray} from '@/utils/is';
import {completeFeedbackQuestionApi, submitFeedbackQuestionApi} from '@/services/feedback';
import {router} from '@/router';

const {cmid,courseid,instance,modname} = getCurPageParam();
const useFeedback=useFeedbackStore();
const page=ref(0);
const curFeedback=computed(() => useFeedback.feedbackData);
const curQuestions=computed(() => useFeedback.questions);
const curHasprevpage=computed(() => useFeedback.hasprevpage);
const curNasnextpage=computed(() => useFeedback.hasnextpage);
const submitDate=ref({});
const formRules=ref({});
const formRef=ref();
const alertDialogRef=ref();
const backDialogRef=ref();
const submitLoading=ref(false);
const preLoading=ref(false);
const nextLoading=ref(false);

const styles={
    borderColor:'transparent'
};
const handleBack = () => {
    backDialogRef.value.open();
};
const handleSubmit = () => {
    formRef.value.validate().then(res=>{
        alertDialogRef.value.open();
    }).catch(err =>{
        uni.pageScrollTo({
            scrollTop: 0
        });
        Toast('您的回答中存在未填项',{icon:'error'});
    });

};

const formatSubmitValues=()=>{
    let result = {},
        startIndex = 0;
    const questionsRquired = {};
    curQuestions.value.map(question => {
        const { typ = '', required = false, id } = question;
        questionsRquired[`${typ}_${id}`] = required;
    });
    Object.keys(submitDate.value)
        .map(attVal => {
            const curValue = submitDate.value[attVal];
            if (isArray(curValue)) {
                const curId=attVal.split('_')[1];
                const curObj=curQuestions.value.find(item=>item.id==curId);
                console.log(curQuestions.value,curObj,'curObj.choicescurObj.choices');
                if(curObj&&curObj.choices){
                    curObj.choices.map((item,index)=>{
                        if (index == 0) {
                            result[`responses[${startIndex}][name]`] = `${attVal}[0]`;
                            result[`responses[${startIndex++}][value]`] = 0;
                        }
                        if(curValue.includes(item.value)){
                            result[`responses[${startIndex}][name]`] = `${attVal}[${index + 1}]`;
                            result[`responses[${startIndex++}][value]`] = index + 1 ;
                        }else{
                            result[`responses[${startIndex}][name]`] = `${attVal}[${index + 1}]`;
                            result[`responses[${startIndex++}][value]`] = 0 ;
                        }
                    });
                }
            } else {
                const isRadio = /^(multichoice|multichoicerated)_/.test(attVal);
                result[`responses[${startIndex}][name]`] = `${attVal}${isRadio && questionsRquired[attVal] === true ? '[0]' : ''}`;
                result[`responses[${startIndex++}][value]`] = curValue === '' && isRadio ? 0 : curValue;
            }
        });
    return result;
};
const formatForm = () => {
    submitDate.value={};
    curQuestions.value.map(item=>{
        const {typ,id,template,required,presentation}=item;
        if(template==='multichoice-c'){
            if(typ!=='info'&&typ!=='label'){
                submitDate.value={...submitDate.value,[`${typ}_${id}`]:[]};
            }
        }else{
            if(typ!=='info'&&typ!=='label'){
                submitDate.value={...submitDate.value,[`${typ}_${id}`]:''};
            }
        }

        if(typ==='numeric'&&required){
            const presentations=presentation.split('|');
            const minimum= presentations[0] !== '' ? presentations[0] * 1 : null;
            const maximum= presentations[1] !== '' ? presentations[1] * 1 : null;
            if(minimum&&maximum){
                const curRules=[
                    {
                        validateFunction:function(rule,value,data,callback){
                            if (value<minimum || value> maximum) {
                                callback(`输入值应该在${minimum}~${maximum}之间`);
                            }
                            return true;
                        }
                    },
                    {
                        required: true,
                        errorMessage: '标记*的题必须回答'
                    }
                ];
                formRules.value[`${typ}_${id}`]={
                    rules:curRules
                };
            }
        }else if(typ==='numeric'){
            const presentations=presentation.split('|');
            const minimum= presentations[0] !== '' ? presentations[0] * 1 : null;
            const maximum= presentations[1] !== '' ? presentations[1] * 1 : null;
            if(minimum&&maximum){
                const curRules=[
                    {
                        validateFunction:function(rule,value,data,callback){
                            if (value<minimum || value> maximum) {
                                callback(`输入值应该在${minimum}~${maximum}之间`);
                            }
                            return true;
                        }
                    }
                ];
                formRules.value[`${typ}_${id}`]={
                    rules:curRules
                };
            }
        }else if(required){
            const curRules=[
                {
                    required: true,
                    errorMessage: '标记*的题必须回答'
                }
            ];
            formRules.value[`${typ}_${id}`]={
                rules:curRules
            };
        }
    });
};
const confirmSubmit =async () => {
    const curValues=formatSubmitValues();
    if(curValues){
        submitLoading.value=true;
        try{
            const params={
                ...curValues,
                feedbackid: instance,
                page:page.value
            };
            const {success,message}=await submitFeedbackQuestionApi(params);
            if(success){
                completeFeedbackQuestionApi({feedbackid: instance});
                router.back();
            }else{
                Toast(message);
            }

        }finally {
            submitLoading.value=false;
            router.back();
        }

    }else{
        completeFeedbackQuestionApi({feedbackid: instance});
    }

};

const onSubmit =async () => {
    await useFeedback.queryFeedbackQuestion({id:instance,page:page.value});
    formatForm();
};
const handlerPrevClick =async () => {
    formRef.value.validate().then(res=>{
        const curValues=formatSubmitValues();
        preLoading.value=true;
        try{
            const params={
                ...curValues,
                feedbackid: instance,
                page:page.value
            };
            submitFeedbackQuestionApi(params).then(res=>{
                if(res.success){
                    page.value=page.value-1;
                    onSubmit();
                }else{
                    Toast(res.message);
                }

            });
        }finally {
            preLoading.value=false;
        }
    }).catch(err =>{
        uni.pageScrollTo({
            scrollTop: 0
        });
        Toast('请检查表单',{icon:'error'});
    });
};
const handlerNextClick =async () => {
    formRef.value.validate().then(res=>{
        const curValues=formatSubmitValues();
        nextLoading.value=true;
        try{
            const params={
                ...curValues,
                feedbackid: instance,
                page:page.value
            };
            submitFeedbackQuestionApi(params).then(res=>{
                if(res.success){
                    page.value=page.value+1;
                    onSubmit();
                }else{
                    Toast(res.message);
                }
            });
        }finally {
            nextLoading.value=false;
        }
    }).catch(err =>{
        uni.pageScrollTo({
            scrollTop: 0
        });
        Toast('请检查表单',{icon:'error'});
    });
};
onLoad(async (options) => {
    await useFeedback.queryFeedbackQuestion({id:instance,page:page.value});
    formatForm();
});
</script>

<style style lang="scss" scoped>
::v-deep .uni-data-checklist .checklist-group {
  display: flex;
  flex-direction: column;
}
::v-deep .uni-data-checklist .checklist-group .checklist-box {
  padding-top: 10rpx;
}
.item {
  width: 100%;
  padding: 20rpx 0 40rpx 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  .title {
    width: 100%;
    padding: 10rpx 20rpx;
    margin-bottom: 20rpx;
    border-bottom: 2rpx solid #e0e0e0;
  }
  .item-context {
    padding: 10rpx 20rpx;
  }
}
.required {
  color: #d70022;
  padding-right: 10rpx;
}
.container {
  padding: 20rpx;
}

</style>
