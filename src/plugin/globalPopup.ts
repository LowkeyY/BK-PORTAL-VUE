/*
 * @Author: Lowkey
 * @Date: 2024-03-14 17:14:47
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-15 15:19:38
 * @FilePath: \BK-Portal-VUE\src\plugin\globalPopup.ts
 * @Description: 
 */

import { createApp } from 'vue';
import Popup from '@/components/Popup/Popup.vue';
const globalPopup = {
    install(app:any) {
        let popupInstance: any = null;
        let mountNode: HTMLElement | null = null;
        app.config.globalProperties.$showPopup = function(options:Record<string,any>) {
          if(!popupInstance){
            popupInstance = createApp(Popup, {
                ...options
            });
        
           mountNode = document.createElement('div');
            document.body.appendChild(mountNode);
           popupInstance.mount(mountNode);

           popupInstance.config.globalProperties.$removePopup = function() {
            // 给Popup组件全局注册删除dom节点方法
            if (popupInstance && mountNode) {
                popupInstance.unmount();
                document.body.removeChild(mountNode);
                popupInstance=null 
            }
        };
          }
        };     
       
    }

};
  
export default globalPopup;