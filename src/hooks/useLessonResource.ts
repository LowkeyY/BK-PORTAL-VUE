/*
 * @Author: Lowkey
 * @Date: 2024-02-26 14:26:07
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-19 14:32:57
 * @FilePath: \BK-Portal-VUE\src\hooks\useLessonResource.ts
 * @Description: 
 */
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { router } from '@/router';
import {Modal,Toast,Loading,HideLoading,prettifyModal} from '@/utils/uniapi/prompt';
import {resourceType} from '@/utils/constants';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';
import { useOpenUrl } from './useOpenUrl';
import useFiles from './useFiles';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const QUERY_URL = `${CUNOVS_SERVER}/url/${moodleToken}`; // 请求url资源
const QUERY_RESOURCE = `${CUNOVS_SERVER}/resource/${moodleToken}`;
const UPDATE_URL_STATE = `${CUNOVS_SERVER}/url/view/${moodleToken}`;
const {openFile} = useFiles();

export default function useLessonResource() {
  
    const getResourceType = (type:string)=>{
        return resourceType[type]||'资源活动';
    };
    const changeRouter  =(pathName:string,params:Record<string,any>)=>{
        router.push({
            name:pathName,
            params
        });
    };

    /**
     * @description: 查询URL地址
     * @param {Record} params
     * @param {*} any
     * @return {*}
     */    
    const queryUrl = (params:Record<string,any>)=>{
        const {courseid} = params;
        http.get(QUERY_URL,params).then((res:Record<string,any>)=>{
            const {success,data,message='获取资源失败'} = res;
            if(success&&data.length){
                const targetParams = data[0];
                handleResourceClick(targetParams,courseid);
            }else{
                Toast(message);
            }
        });
    };

    /**
     * @description: 点击更新URL资源状态
     * @param {string} urlid
     * @return {*}
     */
    const updateUrlState = (urlid:string)=>{
        http.get(UPDATE_URL_STATE,{urlid});
    };

    /**
     * @description: 请求源文件地址
     * @param {Record} params
     * @param {*} any
     * @return {*}
     */    
    const queryFiles = (params:Record<string,any>)=>{
        Loading('正在加载文件...');
        const {courseid,cmid,instance,...others} = params;
        const queryParams = {
            cmid,
            courseid,
            resourceid: instance
        };
        http.get(QUERY_RESOURCE,queryParams).then((res:Record<string,any>)=>{
            const {success,data,message='获取资源失败'} = res;
            if(success){
                handleResourceClick({...others,instance,contents:data,id:cmid},courseid);
            }else{
                Toast(message);
            }
        }).finally(()=>{
            HideLoading();
        });
    };

    
    const handleResourceClick = (params:any,courseid?:string|number)=>{
        const { modname = '', modulename = '', name='',id = '', instance = '', httpurl = '', contents = [{}],coursewareID, tracking = '2', stats = {},href} = params as any;
        const { state = 0 } = stats;
        const modType =  modname || modulename;
        const defaultParams:Record<string,any> = {
            cmid: id,
            courseid,
            instance,
            modname:modType
        };
        switch (modType) {
            case 'page': 
            case 'forum': 
            case 'quiz': 
            case 'assign': 
            case 'feedback': 
            case 'choice': 
            case 'folder': 
                changeRouter(modType,defaultParams);
                break;
              
            case 'svp':
            case 'superclass':
                changeRouter('superClass',defaultParams);
                break;
            case 'resource':
                if (Object.keys(contents[0]).length > 0) {
                    // 不需要请求源文件，下载文件
                   
                    const {fileurl='', filesize= 0} = contents[0];
                    openFile({
                        fileSize:filesize,
                        fileUrl: `${fileurl}${fileurl.indexOf('?') === -1 ? '?' : '&'}token=${moodleToken}`
                    });
                }else{
                    // 请求源文件
                    queryFiles(defaultParams);
                }
                break;
            case 'url':
                updateUrlState(instance);
                queryUrl(defaultParams);
                break;
            case 'httpurl':
                useOpenUrl(httpurl);
                break;
            case 'mdlres':
                changeRouter('courseware',{
                    ...defaultParams,
                    coursewareID,
                    tracking,
                    state,
                });
                break;
            case 'label':
                if(href){
                    Modal({
                        title:'不能查看此资源',
                        content:`请先按要求完成【${name}】`,
                        showCancel:false,
                        confirmText:'知道了'
                    });
                }
                break;
            default: // 默认提示无法显示
                if (modType !== '') {
                    Modal({
                        title:`移动端不兼容${getResourceType(modType)}`,
                        content:'请使用网页版学习平台参与此活动。',
                        showCancel:false,
                        confirmText:'知道了'
                    });
                }
        }
    };
  
    const handlerTagAHrefParseParam = (params:any, courseid?:string|number) => {
        const { modname = '' } = params;

        if (modname !== '') {
            let targetParams = '';
            if (modname === 'resource') {
                const {
                    fileurl = '', filesize=0, href = '', id = '', ...otherParams
                } = params;
                if (id === '' && (fileurl !== '' || href !== '')) {
                    targetParams = {
                        contents: [{
                            fileurl: fileurl || href,
                            filesize
                        }],
                        ...otherParams
                    };
                }
            }
            handleResourceClick(targetParams !== '' ? targetParams : params, courseid);
        } else {
            Toast('需要查看的标签类型不能为空。');
        }
    };
    /**
     * @description: html 中A标签事件 Attribute 包含 exec_script_func 的标签不能解析，rich-text 事件只有A标签 和img标签
     * @return {*}
     */    
    const handlerLinkClick = (targetParams:Record<string,any>,courseid:string) =>{
        let notHasError = false;
        const {hrefparam} = targetParams;
        if(hrefparam){
            const params = JSON.parse(hrefparam);
            const { href = '' } = params;
            if ((notHasError = (href && courseid)) !== '') {
                handlerTagAHrefParseParam(params, courseid);
            }
            if (!!hrefparam && !notHasError) {
                prettifyModal({
                    modalType:'message',
                    type:'error',
                    content:'无法显示此资源, 请使用网页版学习平台查看此资源!'
                });
            }
        }
    };
    return {
        getResourceType,
        handleResourceClick,
        handlerTagAHrefParseParam,
        handlerLinkClick
    };
}