

<script lang="ts" setup>
import {isBjouUser} from '@/utils';
import {getInformationApi, informationCollectionApi} from '@/services/notifications';
import {portalFileDownload,portalEnclosureDownload} from '@/services/app';
import {getCommonDate} from '@/utils';
import useFiles from '@/hooks/useFiles';

const {openFile} = useFiles();
const loading=ref(false);
const curInformation = ref<Record<string,any>>({});
const curInformationId = ref({});
const dynamicFontSize = ref(''); // 初始动态字体大小
const parseRichText=(html:string)=> {
    return html.replace(/font-size: \d+px;/g, 'font-size: var(--font-size) !important;');
};

const getCurInformation =async () => {
    const {success,data}=await getInformationApi({informationId:curInformationId.value});
    if(success){
        curInformation.value=data;
    }
};

const handelCollection =async () => {
    const {success}=await informationCollectionApi({informationId:curInformationId.value});
    if(success){
        getCurInformation();
    }
};

const handleDownload = (file:Record<string,any>):void=>{
    const {fileId,fileName,groupId} = file;
    const fileParams = {
        fileUrl:curInformation.value.informationType === 1 ?`${portalEnclosureDownload}?fileId=${fileId}`: `${portalFileDownload}/${groupId}`,
        fileSize:file.fileSize,
        fileName
    };
    openFile(fileParams);
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
                <view v-if="isBjouUser()">
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
            <files-content
                :file-list="curInformation.fileList" :property-value="{ fileName:'fileName',
                                                                        fileSize:'fileSize',
                                                                        fileTime:'uploadTime'}" @handle-download="handleDownload"
            />
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

</style>
