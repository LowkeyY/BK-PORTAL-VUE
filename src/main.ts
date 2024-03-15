/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-14 17:33:40
 * @FilePath: \BK-Portal-VUE\src\main.ts
 * @Description: 
 */
import { createSSRApp } from 'vue';
import App from './App.vue';
import 'uno.css';
import { setupStore } from '@/store';
import { setupRouter } from '@/router';
import globalPopup from '@/plugin/globalPopup';
export function createApp() {
    const app = createSSRApp(App);

    // Configure router
    setupRouter(app);

    // Configure store
    setupStore(app);
    app.use(globalPopup);
    return {
        app,
    };
}
