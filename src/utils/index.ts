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
import { getBaseUrl } from '@/utils/env';
import defaultUserIcon from '../static/images/default/userIcon.png';
import defaultImg from '../static/images/default/default.png';
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
export function isBjouUser(): boolean {
    return storage.get(StorageEnum.ORG_CODE) === 'bjou_student';
}

/**
 * @description: 获取头像
 * @param url
 * @param fileId
 * @returns {*}
 */
export const getPortalAvatar = (url: string, fileId: string) => {
    if (fileId) {
        return `${url}?fileId=${fileId}`;
    }
    return defaultUserIcon;
};
/**
 * @description: 课程图片
 * @param path
 * @param curBaseUrl
 * @returns {*}
 */
export function getImages(path: any = '', type = 'defaultImg', curBaseUrl = 'CUNOVS_SERVER') {
    const baseUrl = getBaseUrl()[curBaseUrl];
    const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
    if (path instanceof Blob || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }
    if (path === '' || !path) {
        return type === 'defaultImg' ? defaultImg : defaultUserIcon;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path.match(/token=/) ? path : `${path}?token=${moodleToken}`;
    }
    return `${baseUrl + (path.startsWith('/') ? '' : '/') + path}`.match(/token=/)
        ? `${baseUrl + (path.startsWith('/') ? '' : '/') + path}`
        : `${baseUrl + (path.startsWith('/') ? '' : '/') + path}?token=${moodleToken}`;
}

/**
 * @description: 课程时间
 * @param date
 * @constructor
 */
export const changeLessonDate = (date: any) => {
    if (date === '0') {
        return '-';
    }
    if (date) {
        const currentDate: Date = new Date();
        const currentYear = currentDate.getFullYear(),
            lessonDate = new Date(date * 1000),
            year = lessonDate.getFullYear();
        if (currentYear !== year) {
            return `${year}年${lessonDate.getMonth() + 1}月${lessonDate.getDate()}日`;
        }
        return `${lessonDate.getMonth() + 1}月${lessonDate.getDate()}日`;
    } else {
        return '-';
    }
};
