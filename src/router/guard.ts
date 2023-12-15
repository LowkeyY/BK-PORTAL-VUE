/*
 * @Author: Lowkey
 * @Date: 2023-12-11 13:35:43
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-12 14:44:52
 * @FilePath: \BK-Protal-App-VUE\src\router\guard.ts
 * @Description: 路由守卫
 */


import { Router } from 'uni-mini-router/lib/interfaces';

export function createRouterGuard(router: Router) {
    createBeforeEachGuard(router);
    createAfterEachGuard(router);
}

function createBeforeEachGuard(router: Router) {
  
}

function createAfterEachGuard(router: Router) {
  
}
