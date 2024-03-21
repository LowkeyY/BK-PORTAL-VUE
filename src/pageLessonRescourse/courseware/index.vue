<!--
 * @Author: Lowkey
 * @Date: 2024-02-26 16:35:33
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-21 17:22:59
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\courseware\index.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar :title="navTitle" right-text="资源反馈" @handle-right-click="handleRightClick" />
        <ComSkeleton type="text" :loading="loading">
            <view class="content">
                <view v-if="wareData.name" class="title">{{ wareData.coursewareName }}</view>
                <view class="resource-content">
                    <view v-if="wareData.coursewareType === 4">
                        <video
                            v-for="(item,index) in wareData.files"
                            id="myVideo"
                            :key="index"
                            :src="`${mediaUrl}${item}`"
                            controls
                            :initial-time="initialTime"
                            :show-mute-btn="true"
                            :title="wareData.coursewareName"
                            enable-play-gesture 
                            :poster="getImages()"
                            @error="videoErrorCallback" 
                            @play="handlePlayVideo"
                            @timeupdate="timeupdate"
                            @ended="playEnded"
                        >
                        </video>
                    </view>
                    <view v-else-if="wareData.coursewareType === 5">
                        <image
                            v-for="(item,index) in wareData.files"
                            :key="index"
                            class="image"
                            :src="`${mediaUrl}${item}`"
                            mode="scaleToFill"
                            @tap="()=>previewImage(item)"
                        />
                    </view>
                    <!-- <view v-else-if="wareData.coursewareType === 1">
                        <files-content
                            :file-list="[wareData]" 
                            :property-value="{ 
                                fileName:'coursewareName',
                                fileSize:'fileSize',
                                fileTime:'createDate'
                            }"
                            @handle-download="handleDownload"
                        />
                    </view> -->
                    <view v-else>
                        <empty text="该资源暂时不支持在移动端浏览" />   
                    </view>
                </view>
            </view>
        </ComSkeleton>
    </app-provider>
</template>
<script lang="ts" setup>
import useLessonResource from '@/hooks/useLessonResource';
import { useUserStore } from '@/store/modules/user';
import { queryInfoApi,addInfoApi,updateFlowApi,queryStateApi } from '@/services/courseware';
import { useSetLog } from '@/hooks/useSetLog';
import {isEmpty} from  '@/utils/is';
import {Toast,prettifyModal} from '@/utils/uniapi/prompt';
import {getImages,getCurPageParam} from '@/utils';
import { getBaseUrl } from '@/utils/env';


const {RESOURE_SERVER,MDLRES_SERVER} =getBaseUrl();
const { getResourceType } = useLessonResource();
const useUser = useUserStore();
const { setLog,setAccessTime} = useSetLog();
const navTitle = ref('');
const queryParams = ref({});
const wareData = ref<Record<string,any>>({});
const startTime =ref();
const initialTime = ref<number>(0);
const loading = ref<boolean>(false);
const userLearningFlowID = ref<string>('');
const isPlayEnded= ref(false); // 是否播放完
const isBack = ref(false); // 是否第一次返回
const router = useRouter();

const mediaUrl = computed(()=>{
    const { mediaPrefix } = wareData.value;
    return MDLRES_SERVER !== '' ? mediaPrefix.replace(RESOURE_SERVER, MDLRES_SERVER) : mediaPrefix;
});

const prevImages = computed(()=>{
    const { files } = wareData.value;
    if (!files) {
        return [];
    }
    const arr:string[] = [];
    files.map(item=> arr.push(mediaUrl.value + item));
    return arr;
});

const pageParams = getCurPageParam();
const {cmid,modname,courseid,tracking,state} = pageParams;

const handleRightClick = ()=>{
    console.log(23);
};

const addInfo = async(params:addPlayInfoParams)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const {data,code,message='记录播放信息失败'} = await addInfoApi(params);
        if(code==='2000'){
            userLearningFlowID.value=data.userLearningFlowID;
        }else{
            Toast(message);
        }
    } catch (error) {
        throw error;
    }
};

const updateFlow= async(params:upDateFlowParams)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const {code,message='更新播放信息失败'} = await updateFlowApi(params);
        if(code!=='2000'){
            Toast(message);
        }
    } catch (error) {
        throw error;
    }
};

const videoErrorCallback = ():void=>{
    Toast('视频播放失败！');
};
const  previewImage = (index:number) =>{
    const urls:string[] = prevImages.value;
    uni.previewImage({
        urls,
        current: urls[index]
    });
};
/**
 * @description: 更新当前播放时间，可防抖优化
 * @param {*} event
 * @return {*}
 */
const timeupdate = (event:any):void=>{
    const currentTime = Math.floor(event.detail.currentTime);
    initialTime.value=currentTime;
};

const playEnded = () =>{
    isPlayEnded.value=true;
};

const handlePlayVideo = ():void=>{
    const playStartTime:number = initialTime.value;
    const {coursewareID,courseID,userID} = queryParams.value as coursewareParams;
    const params = {
        coursewareID,
        sourceType: '1',
        terminal: '2',
        playStartTime,
        courseID,
        uID:useUser.moodleUserId,
        scenarioID: cmid,
        userID
    };
    addInfo(params);
};

const query =async (params:coursewareParams)=>{
    loading.value = true;
 
    try {
        const {data,code,message='获取资源失败'} = await queryInfoApi(params);
        if(code==='2000'){
            wareData.value= data;
            initialTime.value=data.lastPlayLength||0;
            if(data.coursewareType === 5){
                const {userID,courseID,coursewareID} = params;
                addInfo({
                    coursewareID,
                    sourceType: '1',
                    terminal: '2',
                    playStartTime: 1,
                    courseID,
                    userID
                });
            }
        }else{
            Toast(message);
        }
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }finally{
        loading.value=false;
        uni.stopPullDownRefresh();
    }
};

const queryState = async(params:mdlresStateParams)=>{
    // eslint-disable-next-line no-useless-catch
    isBack.value = true;
    try {
        const {state,success} = await queryStateApi(params);
        if(success&&Number(state)===1){
            // 资源已标记完成，直接返回
            router.back();
        }else{
            prettifyModal({
                title:'返回？',
                content:'未完成本视频学习，确定要返回吗？',
                onConfirm:()=> router.back(),
                onCancel:()=>isBack.value = false
            });
        }
      
    } catch (error) {
        router.back();
    }
  
};

onPullDownRefresh(()=>{
    if(!isEmpty(queryParams.value)){
        query(queryParams.value as coursewareParams);
    }
});

onLoad(async (options) => {
    if (options) {
        startTime.value= new Date().getTime();
        const { courseid,modname,cmid,coursewareID} = options;
        const userID = useUser.userCode;
        navTitle.value= getResourceType(modname);
        const params = {
            userID,
            courseID:courseid,
            coursewareID
        };
        queryParams.value = params;
        query(params);
        setLog({
            cmid,
            modname,
            courseid
        });
    }
  
});

onUnload(()=>{

    const userid = useUser.moodleUserId;
    setAccessTime({
        startedat:startTime.value,
        endedat: new Date().getTime(),
        cmid,
        modname,
        courseid,
        userid
    });
    if(userLearningFlowID.value !== ''){
        updateFlow({
            playEndTime:initialTime.value,
            userLearningFlowID:userLearningFlowID.value
        });
    }
});

onBackPress((options)=>{
    if (options.from === 'navigateBack') {

        if(!isBack.value&&tracking==='2'&&state==='0'){
            queryState({cmid,courseid,userid:useUser.moodleUserId});
            return true;
        }else{
            return  false;
        }
      
    }
    return false;
});
</script>
<style lang="scss" scoped>
.content {
  padding: $uni-container-padding;
  line-height: $uni-line-height;
  .title {
    font-size: $uni-font-size-lg;
    padding-bottom: 20rpx;
    border-bottom: 1px solid $uni-border-color;
  }
  .resource-content {
    margin-top: 40rpx;
    #myVideo {
      width: 100%;
    }
    .image {
      max-width: 100% !important;
      max-height: 100% !important;
      height: auto !important;
    }
  }
}
</style>



