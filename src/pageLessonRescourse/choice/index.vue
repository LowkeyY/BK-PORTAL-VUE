<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-26 17:25:06
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\webPage\index.vue
 * @Description:
-->


<template>
    <app-provider>
        <nav-bar :title="curChoiceData.name" :use-left-click="true" @handle-left-click="handleBack" />
        <ComSkeleton type="text" :loading="useChoice.choiceLoading">
            <view class="container">
                <uni-title type="h4" :title="curChoiceData.name"></uni-title>
                <render-html v-if="curChoiceData.intro!==''" :html="curChoiceData.intro" :courseid="courseid" />
                <view v-if="curChoiceData.notStartedMsg || curChoiceData.expiredMsg" class="already-submitted">
                    <image class="image" src="/static/svg/statusBox/unuseful.svg" mode="widthFix"></image>
                    <text>您已经完成此活动</text>
                </view>
                <uni-card :is-shadow="false" is-full>
                    <uni-data-checkbox
                        v-model="choiceChecked" :multiple="curChoiceData.allowmultiple"
                        :localdata="curChoiceData.chooseData" :map="mapData" :disable="curChoiceData.allowupdate"
                    >
                    </uni-data-checkbox>
                </uni-card>
                <button v-if="isChoice||curChoiceData.allowupdate" class="save-btn" type="primary" :loading="submitLoading" @click="handleSave">保存我的选择</button>
                <uni-section title="回复" type="line">
                    <view class="uni-px-5 uni-pb-5">
                        <empty v-if="curChoiceData.showresults === 0" text="结果不公开" />
                        <empty v-if="curChoiceData.showresults === 1 && !isChoice" text="结果现在不能查看" />
                        <empty v-if="curChoiceData.showresults === 2 && !curChoiceData.expiredMsg" text="结果现在不能查看" />
                        <qiun-data-charts
                            v-if="isArray(curChoiceData.chooseResult)&&curChoiceData.chooseResult.length>0"
                            type="bar"
                            :opts="opts"
                            :chart-data="formatChartData(curChoiceData.chooseResult)"
                        />
                    </view>
                </uni-section>
            </view>
            <uni-popup ref="alertDialogRef" type="dialog">
                <uni-popup-dialog
                    type="warn" cancel-text="取消" confirm-text="保存" title="提交" content="确定要保存吗???"
                    @confirm="confirmSubmit"
                ></uni-popup-dialog>
            </uni-popup>
            <uni-popup ref="backDialogRef" type="dialog">
                <uni-popup-dialog
                    type="info" cancel-text="取消" confirm-text="确定" title="你还未投票？" content="离开后不保存当前投票"
                    @confirm="router.back()"
                ></uni-popup-dialog>
            </uni-popup>
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import {getCurPageParam} from '@/utils';
import {useChoiceStore} from '@/store/modules/choice';
import {isArray, isEmpty} from '@/utils/is';
import {submitChoiceApi} from '@/services/choice';
import {Toast} from '@/utils/uniapi/prompt';
import {router} from '@/router';

const {courseid,instance,cmid} = getCurPageParam();
const title = ref('投票');
const useChoice=useChoiceStore();
const curChoiceData=computed(() => useChoice.choiceData);
const choiceChecked=ref();
const mapData={text:'text',value:'id'};
const alertDialogRef=ref();
const backDialogRef=ref();
const queryParams=ref({});
const isChoice=computed(() =>curChoiceData.value.chooseData.find(item=>item.checked === true));
const opts=reactive({
    color: ['#1890FF'],
    padding: [15,30,0,5],
    enableScroll: false,
    legend: {
        show: false
    },
    xAxis: {
        boundaryGap: 'justify',
        disableGrid: true,
        min: 0,
        axisLine: true,
    },
    yAxis: {
        axisLine: false,
    },
    extra: {
        bar: {
            type: 'stack',
            width: 30,
            meterBorde: 1,
            meterFillColor: '#FFFFFF',
            activeBgColor: '#000000',
            activeBgOpacity: 0.08,
            categoryGap: 2
        }
    }
});
const submitLoading=ref(false);

const formatChartData=(arr)=>{
    const curData = {
        categories: arr.map(item=>item.text),
        series: [
            {
                name: '数量',
                data: arr.map(item=>item.numberofuser),

            }
        ]
    };
    return JSON.parse(JSON.stringify(curData));
};

const getChoiceChecked = () => {
    const checkedArr=curChoiceData.value.chooseData.filter(item=>item.checked === true);
    if(checkedArr.length===1){
        choiceChecked.value=checkedArr[0].id;
    }
    if(checkedArr.length>1){
        choiceChecked.value=checkedArr.map(item=>item.id);
    }
};
const handleSave = () => {
    if(choiceChecked.value){
        alertDialogRef.value.open();
    }else{
        Toast('你还未投票');
    }

};
const confirmSubmit =async () => {
    submitLoading.value=true;
    try{
        const {success}=await submitChoiceApi({
            voteId:instance,
            choiceid:isArray(choiceChecked.value)?choiceChecked.value.join(','):choiceChecked.value
        });
        if(success){
            await useChoice.queryChoice({voteId:instance, courseid});
            getChoiceChecked();
        }
    }finally {
        submitLoading.value=false;
    }
};
const handleBack = () => {
    if(!choiceChecked.value){
        backDialogRef.value.open();
    }
};

onPullDownRefresh(()=>{
    if(!isEmpty(queryParams.value)){
        useChoice.queryChoice(queryParams.value);
        getChoiceChecked();
    }
});

onLoad(async ()=>{
    const curParams={
        voteId:instance,
        courseid
    };
    queryParams.value=curParams;
    await useChoice.queryChoice(curParams);
    getChoiceChecked();
});
</script>
<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
::v-deep .uni-data-checklist .checklist-group {
  display: flex;
  flex-direction: column;
}
::v-deep .uni-data-checklist .checklist-group .checklist-box .checklist-content {
  padding: 20rpx 0;
  font-size: 40rpx;
}
.already-submitted,
.notopen {
  padding: 20rpx 20rpx 10rpx 0;
  display: flex;
  align-items: center;
  border-bottom: 4rpx solid #d81e06;
  .image {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }
}
.save-btn{
    margin: 20rpx 0;
}
</style>
