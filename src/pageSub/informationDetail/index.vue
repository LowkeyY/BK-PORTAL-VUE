
<script lang="ts" setup>
import LoadingIcon from '@/components/LoadingIcon/index.vue';
import {getInformationApi, informationCollectionApi} from '@/services/notifications';
import {getCommonDate, getFileIcon} from '@/utils';

const loading=ref(false);
const curInformation = ref({});
const curInformationId = ref({});
const dynamicFontSize = ref(''); // 初始动态字体大小
const parseRichText=(html)=> {
    return html.replace(/font-size: \d+px;/g, 'font-size: var(--font-size) !important;');
};

const getCurInformation =async () => {
    const {success,data}=await getInformationApi({informationId:curInformationId.value});
    if(success){
        curInformation.value=data;
    }
    console.log(curInformation.value);
};

const handelCollection =async () => {
    const {success}=await informationCollectionApi({informationId:curInformationId.value});
    if(success){
        getCurInformation();
    }
};
const downloadFile = (data,index)=>{
    if(curInformation.value.fileList[index].loading)return;
    console.log(data,index);
    curInformation.value.fileList[index].loading=true;
    setTimeout(()=>{
        curInformation.value.fileList[index].loading=false;
    },1000);
};

onLoad(async option => {
    const {informationId,categoryName}=option;
    if(categoryName){
        uni.setNavigationBarTitle({
            title:categoryName
        });
    }
    curInformationId.value=informationId;
    loading.value=true;
    await getCurInformation();
    loading.value=false;
});
</script>
<template>
    <view class="main">
        <LoadingIcon :loading="loading"></LoadingIcon>
        <view class="container">
            <uni-title type="h3" :title="curInformation.title"></uni-title>
            <view class="information-msg">
                <text>{{ `来源：${curInformation.informationSource}` }}</text>
                <text>发布时间：{{ getCommonDate(curInformation.createDate / 1000, false) }}</text>
                <view>
                    <uni-icons
                        :type="curInformation.isCollection?'star-filled':'star'" size="22"
                        :color="curInformation.isCollection?'#ff9c15':'#999'" @click="handelCollection"
                    >
                    </uni-icons>
                </view>
            </view>
            <view class="information-detail outer-box" :style="{ '--font-size': dynamicFontSize }">
                <rich-text :nodes="curInformation.informationDetail?parseRichText(curInformation.informationDetail):null"></rich-text>
            </view>
            <view v-if="curInformation.fileList?.length>0">
                <uni-section title="附件" type="line" style="background-color: transparent;">
                    <uni-list :border="false">
                        <uni-list-item
                            v-for="(file,index) in curInformation.fileList" :key="file.fileId" ellipsis="1" clickable
                            :title="file.fileName" :note="getCommonDate(file.uploadTime / 1000)"
                            @click="downloadFile(file,index)"
                        >
                            <template #header>
                                <image class="icon" :src="getFileIcon(file.fileExt)" style="width: 60rpx;height: 60rpx;padding-right: 20rpx;" mode="aspectFill" />
                            </template>
                            <template #footer>
                                <view class="download">
                                    <button
                                        style="color: #3492cf;background: #f0f8fd;border: 2rpx solid #3492cf;border-radius: 8rpx;font-size: 20rpx;"
                                        size="mini" plain="true" :loading="!!file.loading"
                                    >
                                        {{ file.loading?'下载中':'下载' }}
                                    </button>
                                </view>
                            </template>
                        </uni-list-item>
                    </uni-list>
                </uni-section>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
@use '@/assets/mixin.scss' as *;
body,
.main {
  background-color: #fff;
}
.container {
  padding: $uni-container-padding;
}
.information-msg {
  @include flex ;

  padding: 0 30rpx 20rpx;
  font-size: $uni-font-size-m;
  color: $uni-text-color-grey;
}
.information-detail {
  border-top: 1px solid #e0e0e0;
  padding: 40rpx 30rpx 0 20rpx;
  font-size: $uni-font-size-m;
}
.outer-box {
  --font-size: 26rpx;
}
.file-box {
  @include flex;
}
</style>
