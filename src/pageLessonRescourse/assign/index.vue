<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-15 17:46:49
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\assign\index.vue
 * @Description: 
-->


<template>
    <app-provider>
        <nav-bar :title="navTitle" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="useAssign.loading">
            <view class="content">
                <view class="title">{{ assignData.assignmentsName }}</view>
                <!-- <view class="course-name">{{ assignData.coursesName }}</view> -->
                <expand-content max-height="400rpx">
                    <render-html :html="assignData.intro" />
                </expand-content>
                <files-content :show-title="false" :file-list="assignData.introattachments" @handle-download="handleDownload" />
               
                <uni-section title="备注" type="line" style="background-color: transparent;">
                    <template #right>
                        {{ `评论（${comments.length}）` }}
                    </template>
                </uni-section>
                <status-info :data="assignData" />
                <view v-if="assignData.gradingstatus === 'graded'" class="tab">
                    <uni-segmented-control :current="currentTab" :values="['提交的作业', '成绩']" style-type="text" active-color="#2b83d7" @click-item="(e)=>currentTab=e.currentIndex" />
                </view>
                <view v-if="assignData.gradingstatus !== 'graded'||currentTab===0">
                    <submited-content v-if="assignData.submitStatus !== 'new'" :data="assignData.submitDataType" />
                    <usability-info :data="assignData" />
                    <view class="actions">
                        <button v-if="assignData.canedit" type="primary" @click="handleGoSubmitAssign">{{ assignData.submitStatus === 'new' ? '提交作业' : '编辑提交的作业' }}</button>
                        <view v-if="assignData.cansubmit" class="submit">
                            <button type="warn" @click="handleGoSubmitAssign">提交作业</button>
                            <view class="tips">*本作业一旦提交，您将不能再作任何修改。</view>
                        </view>
                    </view>
                </view>
                <view v-if="currentTab===1">
                    <uni-section title="最终成绩" type="square" style="background-color: transparent;">
                        <template #right>
                            <view class="grade">
                                {{ gradeData.gradefordisplay }}
                            </view>
                        </template>
                    </uni-section>
                   
                    <view class="feedback">
                        <view v-for="(item,index) in gradeData.feedbackplugins" :key="index">
                            <uni-section :title="item.name" type="line" style="background-color: transparent;">
                                <view v-if="item.type === 'comments'">
                                    <view v-if="item.editorfields[0].text !== '' ">
                                        <render-html :html="item.editorfields[0].text" />
                                    </view>
                                    <empty v-else text="暂无反馈" />   
                                </view>
                                <view v-else>
                                    <view v-if="item.fileareas[0].files.length">
                                        <files-content :show-title="false" :file-list="item.fileareas[0].files" @handle-download="handleDownload" />
                                    </view>
                                    <empty v-else :show-image="false" text="暂无反馈文件" /> 
                                </view>
                            </uni-section>
                        </view>
                    </view>

                    <view>
                        <uni-section title="评分人" type="line" style="background-color: transparent;">
                            <uni-list :border="false">
                                <uni-list-chat
                                    :avatar-circle="true" 
                                    :title="gradeData.gradeUser.fullname" 
                                    :avatar=" isUsefulPic(gradeData.gradeUser.avatar) ?getImages(gradeData.gradeUser.avatar, 'user'):''" 
                                    :note="getCommonDate(gradeData.timemodified)"
                                ></uni-list-chat>
                            </uni-list>
                        </uni-section>
                    </view>
                </view>
            </view>
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import StatusInfo from './components/StatusInfo.vue';
import SubmitedContent from './components/SubmitedContent.vue';
import UsabilityInfo from './components/UsabilityInfo.vue';
import { useUserStore } from '@/store/modules/user';
import { useAssignStore } from '@/store/modules/assign';
import { useSetLog } from '@/hooks/useSetLog';
import {handleJumpToPage} from '@/utils/handle';
import {getCurPageParam,getImages,getCommonDate} from '@/utils';
import { isEmpty,isUsefulPic } from '@/utils/is';

const useUser = useUserStore();
const useAssign = useAssignStore();
const { setLog } = useSetLog();
const { getResourceType,handlerTagAHrefParseParam } = useLessonResource();
const navTitle = ref('');
const assignData = computed(()=>useAssign.assignData);
const gradeData = computed(()=>useAssign.assignData.grade||{});
const comments =  computed(()=>useAssign.comments);
const queryParams=ref({});
const currentTab = ref(0);
const handleRightClick = ()=>{
    console.log(23);
};
const handleDownload = (file:Record<string,any>):void=>{
    const {fileurl,filesize} = file;
    const fileParams = {
        fileurl,
        filesize,
        modname:'resource'
    };
    handlerTagAHrefParseParam(fileParams);
};
const refresh = (params)=>{
    useAssign.queryAssign(params);
};
const handleGoSubmitAssign = () =>{
    const pageParams = getCurPageParam();
    const {courseid,instance} = pageParams;
    const params = {
        courseid,
        instance,
        submitStatus:assignData.value.submitStatus
    };
  
    handleJumpToPage('assignSubmit',params);
};



onPullDownRefresh(()=>{
    if(!isEmpty(queryParams.value)){
        refresh(queryParams.value);
    }
});

onShow(async ()=>{
    setTimeout(()=>{
        refresh(queryParams.value);
    },0);
});
onLoad(async (options) => {
    if (options) {
        const { courseid,modname,instance,cmid} = options;
        const userid = useUser.moodleUserId;
        navTitle.value= getResourceType(modname);
        const assignParams = {
            cmid,userid,courseid,ssignId:instance
        };
        queryParams.value = assignParams;
        refresh(assignParams);
        setLog({
            cmid,
            modname,
            courseid
        });
    }
});
</script>
<style lang="scss" scoped>
.content {
  padding: $uni-container-padding;
  line-height: $uni-line-height;
  .title {
    font-size: $uni-font-size-lg;
  }
  .tab {
    border-top: 1px solid $uni-border-color;
  }
  .actions {
    padding: 0 60rpx;
    margin: 30rpx 0;
    .submit {
      margin-top: 30rpx;
      .tips {
        color: #d24747;
        margin: 30rpx 0;
        font-size: $uni-font-size-base;
      }
    }
  }
  .grade {
    color: #ff9a1b;
    font-size: $uni-font-size-lg;
  }
}
</style>
