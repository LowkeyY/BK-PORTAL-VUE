<!--
 * @Author: Lowkey
 * @Date: 2024-04-30 14:18:34
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-30 15:54:11
 * @FilePath: \BK-Portal-VUE\src\pageOuchn\examination\index.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar title="考试成绩" />
        <view class="segmented">
            <uni-segmented-control :current="current" :values="['本次成绩','历次成绩']" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
       
        <uni-table ref="table" :loading="loading" border stripe empty-text="暂无更多数据" @selection-change="selectionChange">
            <uni-tr>
                <uni-th width="150" align="center" sortable @sort-change="(e)=>handleSort(e,'cNameSortValue')">课程名称</uni-th>
                <uni-th width="40" align="center">考试次数</uni-th>
                <uni-th width="80" align="center" sortable @sort-change="(e)=>handleSort(e,'ksdm')">考试代码</uni-th>
                <uni-th width="80" align="center">平时成绩</uni-th>
                <uni-th width="80" align="center">卷面成绩</uni-th>
                <uni-th width="80" align="center" sortable @sort-change="(e)=>handleSort(e,'totalScore')">综合成绩</uni-th>
            </uni-tr>
            <uni-tr v-for="(item, index) in examList" :key="index">
                <uni-td align="center">{{ item.courseName }}</uni-td>
                <uni-td align="center">{{ item.examNum }}</uni-td>
                <uni-td align="center">{{ item.ksdm }}</uni-td>
                <uni-td align="center">{{ item.normalScore }}</uni-td>
                <uni-td align="center">{{ item.rollScore }}</uni-td>
                <uni-td align="center">{{ item.totalScore }}</uni-td>
            </uni-tr>
        </uni-table>
    </app-provider>
</template>

<script setup lang="ts">
import {queryExamListApi} from '@/services/ouchn/list';
import {Toast} from '@/utils/uniapi/prompt';
const current = ref(0);
const examList = ref([]);
const loading = ref(false);
const params = ref({});
const sortId = (a, b, type) => {
    return Number(b[type]) - Number(a[type]);
};
const sortTable = (table, type,sortType) => {
    let sortList = table;
    if(sortType==='ascending'){
        sortList = table.sort((a, b) => sortId(a, b, type));
    }else if(sortType==='descending'){
        sortList = table.sort((a, b) => sortId(b, a, type));
    }
    examList.value = sortList;
};
const onClickItem =async (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
        if(e.currentIndex===0){
            params.value= { examYear:new Date().getFullYear()};
            queryExamList(params.value);
        }else{
            params.value={};
            queryExamList(params.value);
        }
    }
};

const handleSort = (e,queryType) =>{
    const sortParams = {
        ...params.value,
        cNameSortValue:e.order==='descending'?'desc':'asc'
    };
    if(queryType!=='cNameSortValue'){
    // 本地排序
        console.log(e);
        sortTable(examList.value,queryType,e.order);
    }else{
        queryExamList(sortParams);
    }
};



const queryExamList =async (params) =>{
    loading.value=true;
    try {
        const {code,data,message='查询失败'}= await queryExamListApi(params);
        if(code===0){
            examList.value = data.examScoreList || [];
        }else{
            Toast(message);
        }
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }finally{
        loading.value=false;
    }
};

onLoad(async ()=>{
    current.value=0;
    params.value={ examYear:new Date().getFullYear()};
    queryExamList(params.value);
  
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 20px 100rpx;
  background-color: #fff;
  .segmented {
    margin-bottom: 80rpx;
  }
}
</style>
