<!--
 * @Author: Lowkey
 * @Date: 2024-04-02 15:17:02
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-15 17:50:44
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\components\QuizNavigate.vue
 * @Description: 
-->
<template>
    <uni-section :title="type==='navigate'?'题目导航':'答题情况报告'" type="line">
        <uni-list :class="{list:type==='navigate'}">
            <uni-list-item
                v-for="item in useQuiz.navigate" :key="item.solt"
                :right-text="item.status"
                show-arrow 
                clickable
                @click="()=>handleNavigateClick(item.page)"
            >
                <template #header>
                    <view class="title" :class="{active:item.page===useQuiz.currentPage&&type==='navigate'}">{{ item.type !== 'description' ? `题目${item.number}` : '信息' }}</view>
                </template>
            </uni-list-item>
            <uni-list-item v-if="type==='navigate'" title="结束答题" show-arrow clickable @click="handleFinishClick" />
        </uni-list>
    </uni-section>
    <view v-if="type==='report'" class="actions">
        <button class="goback" @click="useQuiz.uiType='paper'">返回</button>
        <button type="primary" @click="handleSubmit">提交所有答案并结束</button>
    </view>
</template>

<script setup name="QuizNavigate" lang="ts">
import { useQuizStore } from '@/store/modules/quiz';
import { Toast } from '@/utils/uniapi/prompt';
const useQuiz = useQuizStore();

defineProps({
    type: {
        type: String,
        default: 'navigate'
    }
});
const emits = defineEmits(['handle-finish','handle-change-navigate','handle-submit']);

const handleFinishClick = ()=>{
    emits('handle-finish');
};
const handleSubmit = ()=>{
    emits('handle-submit');
};
const handleNavigateClick = (page:number)=>{
    if(useQuiz.quizData.navmethod==='sequential'){
        Toast('请按顺序答题');
    }else{
        emits('handle-change-navigate',page);
    }
    
};

</script>

<style lang="scss" scoped>
.list {
  width: 60vw;
  padding-right: 12rpx;
}
.title {
  font-size: $uni-font-size-lg;
  margin-right: 80rpx;
  padding-left: 10rpx;
}
.active {
  border-left: 8rpx solid $uni-color-primary;
}
.actions {
  padding: 0 60rpx 60rpx;
  margin: 60rpx 0 0;
  .goback {
    margin-bottom: 40rpx;
  }
}

</style>