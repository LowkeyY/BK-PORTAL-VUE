/*
 * @Author: Lowkey
 * @Date: 2023-12-11 13:35:43
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-20 18:29:29
 * @FilePath: \BK-Portal-VUE\src\router\guard.ts
 * @Description: 路由守卫
 */


import { Router } from 'uni-mini-router/lib/interfaces';
export function createRouterGuard(router: Router) {
    createBeforeEachGuard(router);
    createAfterEachGuard(router);
}

function createBeforeEachGuard(router: Router) {
    // router.beforeEach((to,from,next)=>{
       
    //     console.log(to);
    //     next();
    // });
}

function createAfterEachGuard(router: Router) {
   
}
