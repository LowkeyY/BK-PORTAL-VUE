/* eslint-disable no-useless-catch */
/*
 * @Author: Lowkey
 * @Date: 2024-03-06 12:23:04
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-18 13:24:24
 * @FilePath: \BK-Portal-VUE\src\store\modules\assign.ts
 * @Description: 
 */
import {defineStore} from 'pinia';
import {Toast} from '@/utils/uniapi/prompt';
import {queryAssignApi,queryAssignCommentsApi,saveAssignApi,submitAssignApi} from '@/services/assign';
import {ErrorPrompt} from '@/enums/appEnum';
import {isArray} from '@/utils/is';

interface UserState {
    assignData: Record<string,any>;
    loading:boolean;
    saveLoading:boolean;
    comments:any[];
    submitLoading:boolean
}

export const useAssignStore = defineStore({
    id: 'assign',
    state: (): UserState => ({
        assignData:{},
        loading:false,
        saveLoading:false,
        comments:[],
        submitLoading:false
    }),
    getters: {
        /**
         * @description: 获取提交配置信息
         * @param {*} state
         * @return {*}
         */        
        getConfigs:(state)=>{
            const {assignData} =state;
            const {configs} = assignData;
            const fileConfigs:Record<string,any> = {},
                textConfigs:Record<string,any> = {};
            isArray(configs) && configs.map((item, i) => {
                if (item.plugin === 'file') {
                    fileConfigs[item.name] = item.value;
                } else if (item.plugin === 'onlinetext') {
                    textConfigs[item.name] = item.value;
                }
            });
            return { fileConfigs, textConfigs };
        
        },
    },
    actions: {
        async queryAssign(assignParams:AssignParams): Promise<any> {
            const {userid} = assignParams;
            try{
                this.loading= true;
                const data = await queryAssignApi(assignParams);
                if(data.success){
                    this.assignData = data;
                    const assignCommentsParams = {
                        cmid:data.cmid,userid,itemid:data.itemid
                    };
                    this.queryAssignComments(assignCommentsParams);
                }else{
                    Toast(ErrorPrompt.RESOURCE_ERROR);
                }
                  
            }catch(err){
                throw err;
            }finally{   
                this.loading= false;
                uni.stopPullDownRefresh();
            }
        },
        async queryAssignComments(assignCommentsParams:AssignCommentsParams): Promise<any> {
            try{
                const {comments=[],success,message='评论数据加载失败'} = await queryAssignCommentsApi(assignCommentsParams);
                if(success){
                    this.comments = comments;
                } else{
                    Toast(message);
                }
            }catch(err){
                throw err;
            }
        },
        async saveAssign(assignParams:saveAssignParams,callback:Function): Promise<any> {
           
            try{
                this.saveLoading= true;
                const data = await saveAssignApi(assignParams);
                // 后台返回结果未优化 配合request如此判断
                if(data.success&&!data.data){
                    callback&&callback();
                    Toast('保存成功');
                }else{
                    // 复现错误：文本、文件都不传
                    if(isArray(data.data)){
                        Toast(`保存失败-${data.data[0].item}`);
                    }
                   
                }
            }catch(err){
                throw err;
            }finally{   
                this.saveLoading= false;
            }
        },
        async submitAssign(submitParams:submitAssignParams,callback:Function): Promise<any> {
           
            try{
                this.submitLoading= true;
                const {success, message = '请稍后再试', modalAlert = false} = await submitAssignApi(submitParams);
                // 后台返回结果未优化 配合request如此判断
                if(success){
                  
                    Toast('作业提交成功！');
                    callback&&callback();
                }else{
                    // 复现错误：文本、文件都不传
                    // Toast(`保存失败-${data.data[0].item}`);
                }
            }catch(err){
                throw err;
            }finally{   
                this.submitLoading= false;
            }
        },
    }
});
