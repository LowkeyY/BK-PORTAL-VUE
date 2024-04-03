<!--
 * @Author: Lowkey
 * @Date: 2024-03-27 15:17:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-03 13:39:17
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\components\QuizStatusBox.vue
 * @Description: 
-->
<template>
    <view v-if="data.length" class="container">
        <uni-section title="您上次答题的状态" type="line">
            <view class="header">
                <view>试卷</view>
                <view>状态</view>
                <view>{{ `成绩/${maxgrade}` }}</view>
            </view>
            <view v-for="(item,index) in data" :key="index" class="status" @click="()=>handleAttemptClick(item)">
                <view>{{ item.attempt }}</view>
                <view>
                    <view>{{ getStatus(item.state) }}</view>
                    <view>{{ item.timefinish > 0 ? getCommonDate(item.timefinish) : '-' }}</view>
                </view>
                <view>
                    <view v-if="item.state === 'finished'">{{ !isNaN(item.sumgrades) ? `${getGrade(item.sumgrades,maxgrade,decimalpoints,sumgrades)}/${maxgrade}` : '-' }}</view>
                    <view v-else>-</view>
                </view>
            </view>
        </uni-section>
    </view>
</template>

<script setup name="QuizStatusBox" lang="ts">
import { getCommonDate } from '@/utils';
import {handleJumpToPage} from '@/utils/handle';
defineProps({
    data: {
        type: Array as any,
        default:()=>[]
    },
    decimalpoints:{
        type:Number,
        default:2
    },
    maxgrade:{
        type:Number,
        default:100
    },
    sumgrades:{
        type:Number,
        default:100
    },
});

const getGrade = (curSum:number,maxgrade:number,decimalpoints:number,sumgrades:number,)=>{
    let num = curSum * maxgrade / sumgrades;
    if (num >= 0.00005) {
        const multiplier = Math.pow(10, decimalpoints);
        num = Math.round(num * multiplier) / multiplier;
    } else {
        num = 0;
    }
    return num;
};
const getStatus = (type:string) => {
    const res:Record<string,any> = {
        inprogress: '进行中',
        finished: '完成',
        abandoned: '从未提交',
        overdue: '逾期'
    };
    return res[type]||'-';
};

const handleAttemptClick=(item:Record<string,any>):void=>{
    const {state,id} = item;
    if(state==='finished'){
        handleJumpToPage('quizReview',{attemptid:id});
    }
};
</script>

<style lang="scss" scoped>
.container {
  .header {
    display: flex;
    align-items: center;
    font-size: $uni-font-size-base;
    padding: 16rpx 8rpx;
    color: $uni-color-subtitle;
    background: #f5f5f5;
    :nth-child(1) {
      text-align: center;
      flex-basis: 10%;
    }
    :nth-child(2) {
      flex: 1;
      text-align: center;
    }
    :nth-child(3) {
      flex-basis: 20%;
      text-align: center;
    }
  }
  .status {
    display: flex;
    align-items: center;
    font-size: $uni-font-size-base;
    padding: 16rpx 8rpx;
    color: $uni-color-title;
    background: #f5f5f5;
    :nth-child(1) {
      text-align: center;
      flex-basis: 10%;
    }
    :nth-child(2) {
      display: flex;
      flex-direction: column;
      flex: 1;
      text-align: center;
    }
    :nth-child(3) {
      flex-basis: 20%;
      text-align: center;
    }
  }
  .status:nth-child(odd) {
    background: #f5f5f5;
  }
  .status:nth-child(even) {
    background: #fff;
  }
  .status:last-child {
    background: #dae8f3;
  }
}
</style>