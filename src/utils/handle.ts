/*
 * @Author: Lowkey
 * @Date: 2023-12-20 13:13:02
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-28 15:39:12
 * @FilePath: \BK-Portal-VUE\src\utils\handle.ts
 * @Description: 公共事件
 */

import { isUrl } from './is'; 
import { router } from '@/router';
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
export function handleJumpToPage(path:string,params:Record<string,any>):void{
    if (isUrl(path)) {
        // webview 打开
    }else{
        router.push({
            name:path,
            query:params
        });
    }
  
}
export function handleGridsClick(item:Grids):void {
    const { path = '',...others} = item;
    handleJumpToPage(path,{others});
}