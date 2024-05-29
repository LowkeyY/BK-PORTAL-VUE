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
        <nav-bar :title="title" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="useFeedback.loading">
            <view class="container">
                <render-html :html="curFeedback.intro" />
                <view v-if="curFeedback.canviewanalysis" class="tab-container">
                    <uni-segmented-control
                        :current="current" :values="items" style-type="text"
                        active-color="#22609c" @clickItem="onClickItem"
                    />
                    <view v-if="current===0">
                        <uni-list>
                            <uni-list-item show-arrow clickable title="已提交的答案" :right-text="curFeedback.completedcount" @click="handlerChangeRouteClick" />
                            <uni-list-item title="题目" :right-text="curFeedback.itemscount" />
                        </uni-list>
                        <uni-section title="模式" type="line">
                            <view class="container">
                                {{ curFeedback.anonymous === 1 ? '匿名方式' : '实名方式' }}
                            </view>
                            <button v-if="curFeedback.cansubmit" class="answer-btn" @click="handleAnswer">回答问题</button>
                            <view v-if="curFeedback.isalreadysubmitted" class="already-submitted">
                                <image class="image" src="/static/svg/statusBox/yiwancheng.svg" mode="widthFix"></image>
                                <text>您已经完成此活动</text>
                            </view>
                        </uni-section>
                    </view>
                    <view v-if="current===1">
                        <uni-list>
                            <uni-list-item title="已提交的答案" :right-text="curFeedback.completedcount" />
                            <uni-list-item title="题目" :right-text="curFeedback.itemscount" />
                        </uni-list>
                        <view>
                            <view v-for="feedback in curFeedback.itemsdata" :key="curFeedback.id" class="charts-box">
                                <view>{{ feedback.item.name }}</view>
                                <qiun-data-charts
                                    v-if="formatChartData(feedback.data)"
                                    type="bar"
                                    :opts="opts"
                                    :chart-data="formatChartData(feedback.data)"
                                />
                                <view v-else style="height: 120rpx;border-bottom: 2rpx solid #e8e8e8;">
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <uni-section title="模式" type="line">
                        <view class="container">
                            {{ curFeedback.anonymous === 1 ? '匿名方式' : '实名方式' }}
                        </view>
                        <button v-if="curFeedback.cansubmit && curFeedback.isopen" class="answer-btn" @click="handleAnswer">回答问题</button>
                        <view v-if="!curFeedback.isopen" class="notopen">
                            <image class="image" src="/static/svg/statusBox/notopen.svg" mode="widthFix"></image>
                            <text>此反馈未开放</text>
                        </view>
                        <view v-if="curFeedback.isalreadysubmitted" class="already-submitted">
                            <image class="image" src="/static/svg/statusBox/yiwancheng.svg" mode="widthFix"></image>
                            <text>您已经完成此活动</text>
                        </view>
                    </uni-section>
                </view>
            </view>
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import {getCurPageParam} from '@/utils';
import {useFeedbackStore} from '@/store/modules/feedback';
import {useSetLog} from '@/hooks/useSetLog';
import {handleJumpToPage} from '@/utils/handle';
import {useUserStore} from '@/store/modules/user';
import {isEmpty} from '@/utils/is';
const title = ref('');

const {cmid,courseid,instance,modname} = getCurPageParam();
const useFeedback=useFeedbackStore();
const useUser=useUserStore();
const curFeedback=computed(() => useFeedback.feedbackData);
const { setLog } = useSetLog();
const current = ref(0);
const items=['概述', '分析'];
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
const queryParams=ref({});

const handleRightClick = ()=>{
    console.log(23);
};

const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
};
const handleJumpResult = () => {
    const curParams={
        cmid,
        anonymous:curFeedback.value.anonymous,
        id:instance
    };
    handleJumpToPage('feedbackResult', curParams);
};
const handlerChangeRouteClick =async () => {
    const curParams={
        userid:useUser.moodleUserId,
        groupid:0,
        anonymous:curFeedback.value.anonymous,
        cmid,
        id:instance
    };
    await useFeedback.queryResponseFeedbackQuestion(curParams,()=>handleJumpResult);
};

const handleAnswer = () => {
    handleJumpToPage('feedbackDetails', {cmid,courseid,instance,modname});
};

onPullDownRefresh(async ()=>{
    if(!isEmpty(queryParams.value)){
        await useFeedback.queryFeedback(queryParams.value);
        title.value=useFeedback.feedbackData.name;
        setLog({
            cmid,
            modname,
            courseid,
        });
    }
});
onLoad(async (options) => {
    const params={
        id:instance,
        courseid,
        cmid
    };
    queryParams.value=params;
    await useFeedback.queryFeedback(params);
    title.value=useFeedback.feedbackData.name;
    setLog({
        cmid,
        modname,
        courseid,
    });
});
const cnDecode= (json)=> {
    try {
        return eval('(' + json + ')');
    } catch (e) {
        try {
            return JSON.parse(json);
        } catch (e) {
            return json;
        }
    }
};
const formatChartData=(item)=>{
    const formatItem=item.map(item=>cnDecode(item));
    const curData = {
        categories: formatItem.map(item=>item.answertext),
        series: [
            {
                name: '数量',
                data: formatItem.map(item=>item.answercount),

            }
        ]
    };
    if(curData.series[0]?.data?.length>1 && curData.categories?.length>1){
        return JSON.parse(JSON.stringify(curData));
    }else{
        return false;
    }
};
</script>
<style lang="scss" scoped>
::v-deep .segmented-control__item {
  border-bottom: 2rpx solid #22609c;
}
::v-deep .uni-list-item {
  border-bottom: 2rpx solid #eaedf5;
}
::v-deep .segmented-control__item--text {
  border: none;
}
.container {
  padding: 20rpx;
}
.tab-container {
  padding-top: 20rpx;
}
.answer-btn {
  color: #fff;
  background-color: #2b83d7;
  border: 2rpx solid #2b83d7;
  border-radius: 10rpx;
  margin-top: 30rpx;
}
.already-submitted,
.notopen {
  padding: 20rpx 20rpx 10rpx 0;
  display: flex;
  align-items: center;
  border-bottom: 4rpx solid #1eb259;
  .image {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }
}
.notopen {
  border-bottom: 4rpx solid #ecb926;
}
.charts-box {
  padding-top: 40rpx;
}
</style>
