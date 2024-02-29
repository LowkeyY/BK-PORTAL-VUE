/*
 * @Author: Lowkey
 * @Date: 2024-02-27 14:02:13
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-27 19:18:40
 * @FilePath: \BK-Portal-VUE\src\hooks\useFiles.ts
 * @Description: 
 */

import { CURRENT_PLATFORM ,PLATFORMS} from '@/enums/platformEnum';
import {Modal,Toast,Loading,HideLoading} from '@/utils/uniapi/prompt';
import { renderFileSize,pattern } from '@/utils';


interface FileData {
    fileUrl:string,
    fileSize:number,
    fileName?:string
}
const platform = CURRENT_PLATFORM;
export default function  useFiles() {

    const openFile = (file:FileData)=>{
        const {fileUrl='', fileSize= 0,fileName=''} = file;
        const doOpenFile = () =>{
            if(platform===PLATFORMS.H5){
                Toast('正在打开文件...');
                uni.openDocument({
                    filePath: fileUrl,
                    showMenu: true,
                    success: function (res) {
                        console.log('打开文档成功');
                    }
                });
            }else{
                Loading('正在下载文件...');
                uni.downloadFile({
                    url: fileUrl,
                    success: function (res) {
                        const filePath = res.tempFilePath;
                        uni.openDocument({
                            filePath: filePath,
                            showMenu: true,
                            success: function (res) {
                                Toast('正在打开文件');
                            },
                            fail:function(res){
                                Toast('打开文件失败');
                            },

                        });
                    },
                    fail:function(res){
                        Toast('文件下载失败');
                    },
                    complete:function(){
                        HideLoading();
                    }
                });
            }
        };
        if (pattern('zip').test(fileUrl)||pattern('zip').test(fileName)) {
            Modal({
                title:'压缩包文件',
                content:'下载后需要解压缩查看，需要使用手机中安装额外的解压缩软件（如不方便可以转到电脑端访问）。',
                confirmText:'下载',
                complete: function (res) {
                    if (res.confirm) {
                        doOpenFile();
                    } 
                }
            });
        }else if(fileSize > 5242880){
            Modal({
                title:'大文件',
                content:`当前文件共${renderFileSize(fileSize)},下载需消耗大量流量和时间，建议使用电脑端下载。`,
                confirmText:'下载',
                complete: function (res) {
                    if (res.confirm) {
                        doOpenFile();
                    } 
                }
            });
        }else{
            doOpenFile();
        }
    };
   
    return {
        openFile
    };
}
