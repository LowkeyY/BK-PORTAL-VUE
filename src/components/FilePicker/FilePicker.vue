<!--
 * @Author: Lowkey
 * @Date: 2024-03-06 13:38:05
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-15 17:53:19
 * @FilePath: \BK-Portal-VUE\src\components\FilePicker\FilePicker.vue
 * @Description:
-->
<template>
    <view>
        <view>
            <uni-list :border="true">
                <uni-list-item
                    v-for="(file,index) in uploadFiles" :key="index" ellipsis="1"
                >
                    <template #header>
                        <view class="icon">
                            <image :src="getFileIcon(file.name)" style="width: 60rpx;height: 80rpx;padding-right: 20rpx;" mode="scaleToFill" />
                        </view>
                    </template>
                    <template #body>
                        <view class="list-item">
                            <view class="left">
                                <view class="name text-ellipsis-1">{{ file.name }}</view>
                                <view class="info">
                                    <view class="time">
                                        {{ getCommonDate(file.file.lastModified/1000) }}
                                    </view>
                                    <view v-if="isString(file.uuid)" class="size">
                                        已上传
                                    </view>
                                    <view v-else class="size">
                                        {{ renderFileSize(file.size) }}
                                    </view>
                                </view>
                            </view>
                            <uni-icons color="#c14848" type="trash-filled" size="60rpx" @click="()=>deleteFile(file)"></uni-icons>
                        </view>
                    </template>
                </uni-list-item>
            </uni-list>
        </view>
        <view class="tips">
            <view v-if="showTips&&maxSize&&maxFiles">
                {{ `新文件的最大尺寸:${renderFileSize(maxSize)},最多附件${maxFiles}` }}
            </view>
            <view v-if="allowTypes.length">
                <view>
                    <text>文件类型：</text>
                    <text v-for="(item,index) in fileTypeItem" :key="index">
                        {{ item }}
                    </text>
                </view>
                <view v-for="(item,index) in fileTypeKind" :key="index">
                    <text>{{ getAllowTypes(item).name }}</text>
                    <text>
                        {{ getAllowTypes(item).value }}
                    </text>
                </view>
            </view>
        </view>
        <view v-if="uploadFiles.length<maxFiles" class="btn">
            <button type="primary" @click="toggle">添加文件</button>
        </view>
        <uni-popup ref="popupRef" background-color="#fff">
            <view class="popup-content">
                <lsj-upload
                    ref="uploadRef"
                    child-id="upload1"
                    width="600rpx"
                    height="60rpx"
                    :option="option"
                    :count="maxFiles"
                    :formats="allowTypes"
                    :size="curFormatSize"
                    :debug="true"
                    :multiple="false"
                    :instantly="false"
                    :distinct="true"
                    @change="handleChange"
                >
                    <view class="action-item">
                        <uni-icons type="folder-add-filled" size="36rpx" color="#555"></uni-icons>
                        选择文件
                    </view>
                </lsj-upload>
                <view v-if="isShowMic" class="action-item">
                    <uni-icons type="mic-filled" size="36rpx" color="#555"></uni-icons>
                    录制音频
                </view>
                <view class="action-item cancel" @click="popupRef.close();">取消</view>
            </view>
        </uni-popup>
    </view>
</template>

<script setup lang="ts" name="FilePicker">
import {getCommonDate, getFileIcon,renderFileSize} from '@/utils';
import { isString } from '@/utils/is';
import {allowFileTypes} from '@/utils/constants';
import { Toast } from '@/utils/uniapi/prompt';
import {getBaseUrl} from '@/utils/env';
const props = defineProps({
    maxSize: {
        type: Number,
        default: 0
    },
    maxFiles: {
        type: Number,
        default:1
    },
    showTips:{
        type:Boolean,
        default:true
    },
    allowTypes:{
        type:String,
        default:''
    },
    uploadFileList:{
        type:Array<any>,
        default:()=>[]
    },
    fileMediatype:{
        type:String,
        default:'all'
    },
    isShowMic:{
        type:Boolean,
        default:true
    }
});

const popupRef = ref();
const uploadRef = ref();


const {MOODLE_SERVER} =getBaseUrl();
const option= reactive({
    // 上传服务器地址，需要替换为你的接口地址
    url: `${MOODLE_SERVER}/webservice/upload.php`, // 该地址非真实路径，需替换为你项目自己的接口地址
    // 上传附件的key
    name: 'file',
    formData: {}
});
const uploadFiles = ref<any[]>(props.uploadFileList);

const curFormatSize=computed(()=>{
    let temp: number | string = props.maxSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp;
});

// 单选的文件格式
const fileTypeItem = computed(()=>{
    const typeList = props.allowTypes.split(',');
    return typeList.filter(type => type.includes('.'));
});
// 文件格式集合
const fileTypeKind = computed(()=>{
    const typeList = props.allowTypes.split(',');
    return typeList.filter(type => !type.includes('.'));
});

/**
 * @description: 文件去重合并,此逻辑不用考虑上传文件同名是的提示
 * @param {*} files
 * @return {*}
 */
const appendFiles = (files:any[]):any[]=>{

    return Array.from(new Set([...uploadFiles.value, ...files].map(file => file.name)))
        .map(name => {
            const file1 = uploadFiles.value.find(file => file.name === name);
            const file2 = files.find(file => file.name === name);
            return { ...file1, ...file2 };
        });
};

const deleteFile = (file:Record<string,any>)=>{
    uploadFiles.value=uploadFiles.value.filter(item=> item.name!==file.name);
};
const handleSelect = (e:any)=>{
    popupRef.value.close();
    const file = e.tempFiles[0]; // 已限制文件单选
    const {size,extname} = file;
    if(!validateFileType(extname)){
        Toast(`不能上传${extname}类型的文件。`);
        return;
    }
    if(size>props.maxSize){
        Toast('文件过大，不能上传。');
        return;
    }
    nextTick(()=>{
        uploadFiles.value= appendFiles(e.tempFiles);
    });
};

/**
 * @description: 校验上传文件类型
 * @param {*} string
 * @return {*}
 */
const validateFileType = (string:string):boolean=>{
    const extname = `.${string}`;
    if(fileTypeItem.value.length===0){
        return true;
    }
    if(fileTypeItem.value.includes(extname)){
        return true;
    }
    if(fileTypeKind.value.length){
        fileTypeKind.value.forEach(item=>{
            const typeList =  getAllowTypes(item).value;
            if(typeList.includes(extname)){
                return true;
            }
            return false;
        });
    }
    return false;
};

/**
 * @description: 获取提交文件类型
 * @return {*}
 */
const getAllowTypes = (kind:string)=>{
    const res = {
        name:'',
        value:''
    };
    if(allowFileTypes[kind]){
        res.name = allowFileTypes[kind].name,
        res.value = allowFileTypes[kind].value.join(',');
    }
    return res;
};


const handleChange = (files) => {
    //以限制单选
    popupRef.value.close();
    uploadFiles.value= appendFiles([...files.values()]);

};
const toggle = ()=>{
    popupRef.value.open('bottom');
};

defineExpose({
    uploadFiles
});
</script>

<style scoped lang="scss">
::v-deep .uni-file-picker__lists {
  display: none;
}
.list-item {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    width: 90%;
    .name {
      width: 100%;
      font-size: $uni-font-size-lg;
      margin-bottom: 10rpx;
    }
    .info {
      display: flex;
      justify-content: space-between;
      font-size: $uni-font-size-base;
      color: $uni-color-subtitle;
      .size {
        color: #fdb121;
      }
    }
  }
}
.tips {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background: #fff;
  font-size: $uni-font-size-base;
  color: #ff9a1b;
  border-bottom: 4rpx solid #ff9a1b;
}
.btn {
  padding: 0 50rpx;
  margin-bottom: 30rpx;
}
.popup-content {
  padding: 40rpx;
  .action-item {
    font-size: $uni-font-size-lg;
    color: $uni-color-subtitle;
    padding: 0 0 30rpx;
  }
  .cancel {
    padding-top: 30rpx;
    border-top: 1px solid $uni-border-color;
    color: #ca3120;
  }
}
</style>
