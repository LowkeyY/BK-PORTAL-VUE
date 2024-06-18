/* eslint-disable no-useless-catch */
/* eslint-disable indent */
/*
 * @Author: Lowkey
 * @Date: 2024-01-11 12:50:29
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 12:34:37
 * @FilePath: \BK-Portal-VUE\src\hooks\useUploadFiles.ts
 * @Description:
 */
import storage from '@/utils/storage';
import { CURRENT_PLATFORM ,PLATFORMS} from '@/enums/platformEnum';
import {Toast,Loading,HideLoading} from '@/utils/uniapi/prompt';
import { StorageEnum } from '@/enums/storageEnum';
import { getBaseUrl } from '@/utils/env';
import {parseJSON} from '@/utils';
import {isArray} from '@/utils/is';

const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const platform = CURRENT_PLATFORM;
const {MOODLE_SERVER,MANAGE_SERVER} =getBaseUrl();

interface callback {
    successCallback:Function,
    errorCallback?:Function
}

export default function useUploadFiles (callback?:callback){
    const URL = `${MOODLE_SERVER}/webservice/upload.php`;
    const SUGGESTION_URL = `${MANAGE_SERVER}/file/upload`;
    const successData = ref<Record<string,any>>({});
    const itemid = ref(0);

    /**
     * @description: uni.uploadFile封装Promise，执行同步上传
     * @param {Record} file
     * @param {*} any
     * @return {*}
     */
    const uploadFile = (file:Record<string,any>)=>{
        const {path} = file;
        const formData = {
            'token':String(moodleToken),
            'itemid':itemid.value,
            'filearea':'draft'
        };
        return  new Promise((resolve,reject)=>{
            uni.uploadFile({
                url: URL,
                filePath:path,
                method: 'POST',
                // header: {
                //     'Content-Type': 'multipart/form-data',  !!!!!!!!!!!!!!!默认为multipart/form-data手动设置后不会自动添加bocundary边界值导致接收不了formData数据！！！！！！！！
                // },
                timeout: 10000,
                name: 'file',
                formData,
                success: resData => {
                    const { data: responseData, statusCode } = resData;
                    const resultData = parseJSON(responseData);
                    if (statusCode === 200&&isArray(resultData)) {
                        successData.value= resultData[0];
                        itemid.value = resultData[0]?.itemid;
                        resolve(resultData[0]);
                    } else {
                        const { error = '上传失败，请稍后重试' } = resultData;
                        Toast(error);

                    }
                },
                fail: error => {
                    Toast('上传失败，请稍后重试');
                    reject(error);

                }
            });
        });
    };
    const doUpload =async (fileList:any[])=>{
        Loading('正在上传文件...');
        const results:any[] = [];
        for(const file of fileList){
          try {
            // 1上传分已上传的和新曾的 通过file.status==="ready" 判端
            // 2新增的直接使用uploadFile方法上传
            // 3已上传的需要下载后获取本地path在上传
            if(file.status==='ready' || file.type==='waiting'){
              
                const result =  await uploadFile(file); // 同步上传文件
                results.push(result);
            }else{

                // 先下载再上传
               const {tempFilePath} =  await uni.downloadFile({
                    url: `${file.path}?token=${moodleToken}`,
                    // success:async function (res) {
                    //      const filePath = res.tempFilePath;
                    //    const localFile = {
                    //      ...file,
                    //      path:filePath
                    //    };
                    //     const result =  await uploadFile(localFile);
                    //     results.push(result);
                    // }
                });
                     const localFile = {
                         ...file,
                         path:tempFilePath
                       };
                      const result =  await uploadFile(localFile);
                        results.push(result);

            }


          } catch (error) {
            throw error;
            }finally{
                HideLoading();
            }
        }
        // 全部上传完成后执行回调方法
        if(callback){
            const {successCallback} = callback;
            successCallback(results);
        }
    };
    const uploadSuggestionFiles =  (file:Record<string,any>,name:string,formData:Record<string,any>)=>{
        const {path} = file;

        return  new Promise((resolve,reject)=>{
            uni.uploadFile({
                url: SUGGESTION_URL,
                filePath:path,
                method: 'POST',
                timeout: 10000,
                name,
                formData,
                success: resData => {
                   const { statusCode, data} = resData as any;
                   const resultData = parseJSON(data);
                   if(statusCode===200){
                    resolve(resultData.data);
                   } else {
                    Toast('上传失败，请稍后重试');

                }
                },
                fail: error => {
                    Toast('上传失败，请稍后重试');
                    reject(error);

                }
            });
        });
    };
    const doUploadSuggestionFiles =async (imgList:any[])=>{
        Loading('正在上传图片...');
        const results:any[] = [];
        for(const [index,value] of imgList.entries()){
           const formData = {formNames:`opinionFile_${index}`};
           const name = `opinionFile_${index}`;
          try {
            if(value.status==='ready'){
                const result =  await uploadSuggestionFiles(value,name,formData);
                results.push(result);
            }
          } catch (error) {
            throw error;
            }finally{
                HideLoading();
            }
        }
        return results;
    };
    return {
        doUpload,
        uploadSuggestionFiles,
        doUploadSuggestionFiles,
        successData
    };
}

