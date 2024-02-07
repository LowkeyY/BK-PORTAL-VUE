/*
 * @Author: Lowkey
 * @Date: 2023-12-11 13:35:43
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-05 18:11:39
 * @FilePath: \BK-Portal-VUE\src\utils\request.ts
 * @Description:
 */


import { Toast } from '@/utils/uniapi/prompt';
import storage from '@/utils/storage';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { useUserStore } from '@/store/modules/user';
import { router } from '@/router';

interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
    data?: Record<string, any>;
    contentType?:string;
    XMLHttpRequest?:boolean;
  }



const toLogin = () => {
    // useUserStore()
    // .logout()
    // .then(() => {
    //     router.push({ name: 'Login' });
    // });
    router.push({ name: 'Login' });
};
const doDecode = (json:string) => {
    try {
        return eval(`(${json})`);
    } catch (e) {
        return json;
    }
};
const request = async({ url, method='GET', data, contentType=ContentTypeEnum.FORM_URLENCODED,XMLHttpRequest=false }:RequestOptions):Promise<any> => {
   
    return new Promise((reslove, reject) => {
        const header:Record<string, string> =  {
            'Content-Type': contentType,
        };
        if(XMLHttpRequest){
            header['x-requested-with'] = 'XMLHttpRequest';
        }
        uni.request({
            url: url,
            method: method,
            header,
            // timeout: 10000,
            withCredentials:true,
            data: data,
            success: successData => {
                // eslint-disable-next-line prefer-const
                let { data: responseData, statusCode } = successData as {data:any,statusCode:number};
                if (statusCode === 200) {
                    typeof (responseData) === 'string' && (responseData = doDecode(responseData));
                    reslove({
                        success:true, // 部分接口没有success状态，手动添加
                        statusCode,
                        ...responseData
                    });
                } else if (statusCode === 401) {
                  
                    toLogin();
                } else {
                    const { message = '网络连接失败，请稍后重试' } = responseData as {message?:string};
                    Toast(message);
                    reject(data);
                }
            },
            fail: msg => {
                Toast('网络连接失败，请稍后重试');
                reject(msg);
            }
        });
    });
};

const http:Record<string,any>={request};

['options', 'get', 'post', 'put', 'head', 'delete',].forEach(method => {
    http[method] = (url:string, params:Record<string,any>) => request({url,method:method.toUpperCase() as any,data:params});
});

export default http;
