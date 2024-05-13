<template>
    <app-provider>
        <nav-bar title="校历" />
        <empty v-if="!curInformation" text="暂无数据" :loading="loading"/>
        <view class="container" v-else>
            <uni-title type="h3" :title="curInformation.title"></uni-title>
            <view class="information-msg">
                <text>{{ `来源：${curInformation.informationSource}` }}</text>
                <text>发布时间：{{ getCommonDate(curInformation.createDate / 1000, false) }}</text>
                <view v-if="isBjouUser()">
                    <uni-icons
                        :type="curInformation.isCollection?'star-filled':'star'" size="22"
                        :color="curInformation.isCollection?'#ff9c15':'#999'"
                    >
                    </uni-icons>
                </view>
            </view>
            <view class="information-detail outer-box" :style="{ '--font-size': dynamicFontSize }">
                <render-html :html="curInformation.informationDetail" />
            </view>
            <files-content
                :file-list="curInformation.fileList" :property-value="{ fileName:'fileName',
                                                                        fileSize:'fileSize',
                                                                        fileTime:'uploadTime'}" @handle-download="handleDownload"
            />
        </view>
    </app-provider>
</template>

<script setup lang="ts">
import {getCommonDate, isBjouUser} from '@/utils';
import {portalEnclosureDownload, portalFileDownload} from '@/services/app';
import {getBkxlInformationApi} from '@/services/notifications';
import useFiles from '@/hooks/useFiles';


const curInformation = ref<Record<string,any>>({});
const {openFile} = useFiles();
const loading=ref(false);
const handleDownload = (file:Record<string,any>):void=>{
    const {fileId,fileName,groupId} = file;
    const fileParams = {
        fileUrl:curInformation.value.informationType === 1 ?`${portalEnclosureDownload}?fileId=${fileId}`: `${portalFileDownload}/${groupId}`,
        fileSize:file.fileSize,
        fileName
    };
    openFile(fileParams);
};

const getCurInformation =async () => {
    const {success,data}=await getBkxlInformationApi({cateGoryId:'bkxl'});
    if(success){
        curInformation.value=data;
    }
};

onLoad(async option => {
    loading.value=true;
    await getCurInformation();
    loading.value=false;
});

</script>

<style scoped lang="scss">
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
