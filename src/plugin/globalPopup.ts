/*
 * @Author: Lowkey
 * @Date: 2024-03-14 17:14:47
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-07 14:18:05
 * @FilePath: \BK-Portal-VUE\src\plugin\globalPopup.ts
 * @Description:
 */

import { createSSRApp } from 'vue';
import Popup from '@/components/Popup/Popup.vue';
const globalPopup = {
    install(app: any) {
        let popupInstance: any = null;
        // const mountNode: HTMLElement | null = null;
        app.config.globalProperties.$showPopup = function (options: Record<string, any>) {
            const query = uni.createSelectorQuery().in(this);
            if (!popupInstance) {
                popupInstance = createSSRApp(Popup, {
                    ...options,
                });
                //    mountNode = document.createElement('div');
                //     document.body.appendChild(mountNode);

                const mountNode = query.select('#globalPopup');
                // console.log(mountNode);
                popupInstance.mount(mountNode);

                popupInstance.mount('#globalPopup');
                popupInstance.config.globalProperties.$removePopup = function () {
                    //     // 给Popup组件全局注册删除dom节点方法
                    // if (popupInstance && mountNode) {
                    if (popupInstance) {
                        popupInstance.unmount();
                        //         document.body.removeChild(mountNode);
                        popupInstance = null;
                    }
                };
            }
        };
    },
};

export default globalPopup;
