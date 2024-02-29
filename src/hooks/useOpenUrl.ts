/*
 * @Author: Lowkey
 * @Date: 2024-01-11 12:50:29
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-27 19:19:00
 * @FilePath: \BK-Portal-VUE\src\hooks\useOpenUrl.ts
 * @Description: 
 */

import { CURRENT_PLATFORM ,PLATFORMS} from '@/enums/platformEnum';
import { router } from '@/router';

const platform = CURRENT_PLATFORM;
export const useOpenUrl = (url:string) => {
  
    // 根据系统判断打开方式
    //  h5 使用浏览器打开 除此之外默认使用webview 打开
    if(platform===PLATFORMS.H5){
        window.open(url);
    }else{
        router.push({
            name:'webview',
            params:{url: encodeURIComponent(url)}
        });
    }
   
    return {
        useOpenUrl
    };
};
