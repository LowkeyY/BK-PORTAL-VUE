/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 14:28:04
 * @FilePath: \BK-Portal-VUE\src\utils\index.ts
 * @Description: 
 */
import { isObject } from '@/utils/is';
import storage from './storage';
import { StorageEnum } from '@/enums/storageEnum';

/**
 * 深度合并
 * @param src
 * @param target
 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}

/**
 * @description: 登录后写入信息
 * @param {*}
 * @return {*}
 */
export function setStorage(obj: any) {
    Object.keys(obj).map((item) => {
        storage.set(item, obj[item]);
    });
}

/**
 * @description: 是否是北开用户
 * @return {*}
 */
export function isBjouUser():boolean {
    return storage.get(StorageEnum.ORG_CODE) === 'bjou_student';
}