<!--
 * @Author: Lowkey
 * @Date: 2024-03-05 14:06:43
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-18 12:34:54
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\assign\components\StatusInfo.vue
 * @Description: 
-->
<template>
    <view class="contaner">
        <uni-section title="提交状态" type="line" style="background-color: transparent;">
            <template #right>
                <uni-tag style="margin-right: 8rpx;" :text="getSubmitStatus(data.submitStatus).text" :type="getSubmitStatus(data.submitStatus).type" size="small" />
                <uni-tag :text="getGradeStatus(data.gradingstatus).text" :type="getGradeStatus(data.gradingstatus).type" size="small" />
            </template>
        </uni-section>
    </view>
</template>

<script setup name="StatusInfo" lang="ts">
defineProps({
    data: {
        type: Object,
        default: ()=>{}
    }
});


const  getSubmitStatus = (status:string):Record<string,any> => {
    const res = {
        text:'未提交',
        type:'default'
    };
    switch (status) {
      
        case 'new' :
            res.text = '没有提交作业';
            res.type = 'default';
            break;
        case 'draft' :
            res.text = '草稿(未提交)';
            res.type = 'default';
            break;
        case 'submitted' :
            res.text = '已提交';
            res.type = 'success';
            break;
        case 'marked' :
            res.text = '已评分';
            res.type = 'success';
            break;
        case 'reonpened' :
            res.text = '已开启重交';
            res.type = 'warning';
            break;
    }

    return res;
};


const getGradeStatus = (status:string):Record<string,any> => {
    const res = {
        text:'未评分',
        type:'default'
    };
    switch (status) {
        case 'inmarking' :
            res.text = '评分中';
            res.type = 'warning';
            break;
        case 'draft' :
            res.text = '草稿(未提交)';
            res.type = 'default';
            break;
        case 'readyforreview' :
            res.text = '草稿(未提交)';
            res.type = 'default';
            break;
        case 'inreview' :
            res.text = '正在检查评分结果';
            res.type = 'warning';
            break;
        case 'readyforrelease' :
            res.text = '准备公布评分';
            res.type = 'warning';
            break;
        case 'released' :
            res.text = '已公布评分';
            res.type = 'success';
            break;
        case 'graded' :
            res.text = '已评分';
            res.type = 'success';
            break;
        case 'notgraded' :
            res.text = '未评分';
            res.type = 'default';
            break;
    }
    return res;
};

</script>

