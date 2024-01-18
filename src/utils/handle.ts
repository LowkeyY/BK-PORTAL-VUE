/*
 * @Author: Lowkey
 * @Date: 2023-12-20 13:13:02
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-17 13:55:04
 * @FilePath: \BK-Portal-VUE\src\utils\handle.ts
 * @Description: 公共事件
 */

import { isUrl } from './is'; 
import { router } from '@/router';
import { useOpenUrl } from '@/hooks/useOpenUrl';
import { useAppStore } from '@/store/app';

export function exceScript(func:string) {
    if (func) {
        try {
            eval(func);
        } catch (e) {
            console.log(e);
        }
    }
}

/**
 * @description: 
 * @param {string} path
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export function handleJumpToPage(path:string,params?:Record<string,any>):void{
    if (isUrl(path)) {
        // webview 打开
        useOpenUrl(path);
    }else{
        router.push({
            name:path,
            params
        });
    }
}
export function handleGridsClick(item:Grids):void {
    const { path = '',...others} = item;
    if(path==='oauth'){
        const {appType=''} = others;
        useAppStore().getPCLoginCode(appType);
    }else if(path==='payment'){
        useAppStore().getPaymentCode();
    }else{
        handleJumpToPage(path,others);
    }
}