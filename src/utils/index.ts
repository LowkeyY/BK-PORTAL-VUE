/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-18 13:45:40
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
    if (path.startsWith('blob:') || path.startsWith('data:')) {
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

/**
 * @description: 日期转换
 * @param {*} date
 * @param {*} details
 * @param {*} showWeek
 * @return {*}
 */
export const getCommonDate = (date:number, details = true, showWeek = true):string => {
    if (date) {
        const preDate = new Date(date * 1000),
            week = '日一二三四五六'.charAt(preDate.getDay()),
            year = preDate.getFullYear(),
            hour = preDate.getHours() < 10 ? `0${preDate.getHours()}` : preDate.getHours(),
            minutes = preDate.getMinutes() < 10 ? `0${preDate.getMinutes()}` : preDate.getMinutes();
        if (details) {
            if (!showWeek) {
                return `${year}年${preDate.getMonth() + 1}月${preDate.getDate()}日${hour}:${minutes}`;
            }
            return `${year}年${preDate.getMonth() + 1}月${preDate.getDate()}日 星期${week} ${hour}:${minutes}`;
        }
        return `${year}年${preDate.getMonth() + 1}月${preDate.getDate()}日`;
    }
    return '-';
};

/**
 * @description: 聊天时间转换
 * @param {*} timeValue
 * @return {*}
 */
export const getMessageTime = (timeValue:number):string => {
    const time:number = timeValue * 1000;
  
    function formatDateTime (time:number):string {
        const date = new Date(time);
        const y = date.getFullYear();
        let m:string|number = date.getMonth() + 1;
        m = m < 10 ? (`0${m}`) : m;
        let d:string|number = date.getDate();
        d = d < 10 ? (`0${d}`) : d;
        let h:string|number = date.getHours();
        h = h < 10 ? (`0${h}`) : h;
        let minute:string|number = date.getMinutes();
        let second:string|number = date.getSeconds();
        minute = minute < 10 ? (`0${minute}`) : minute;
        second = second < 10 ? (`0${second}`) : second;
        return `${y}-${m}-${d} ${h}:${minute}:${second}`;
    }
  
    // 判断传入日期是否为昨天
    function isYestday (time:number) {
        const date = (new Date()); // 当前时间
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
        const yestday = new Date(today - 24 * 3600 * 1000).getTime();
        return time < today && yestday <= time;
    }
  
    // 判断传入日期是否属于今年
    function isYear (time:number) {
        const takeNewYear = new Date().getFullYear().toString(); // 当前时间的年份
        const takeTimeValue = formatDateTime(time)
            .substring(0, 4); // 传入时间的年份
        return takeTimeValue === takeNewYear;
    }
  
    // 60000 1分钟
    // 3600000 1小时
    // 86400000 24小时
    // 对传入时间进行时间转换
    function timeChange (time:number) {
        const timeNew = new Date().getTime(); // 当前时间
        const timeDiffer = timeNew - time; // 与当前时间误差
        let returnTime = '';
  
        if (timeDiffer <= 60000) { // 一分钟内
            returnTime = '刚刚';
        } else if (timeDiffer > 60000 && timeDiffer < 3600000) { // 1小时内
            returnTime = `${Math.floor(timeDiffer / 60000)}分钟前`;
        } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(time) === false) { // 今日
            returnTime = formatDateTime(time)
                .substring(11, 16);
        } else if (timeDiffer > 3600000 && isYestday(time) === true) { // 昨天
            returnTime = `昨天${formatDateTime(time)
                .substring(11, 16)}`;
        } else if (timeDiffer > 86400000 && isYestday(time) === false && isYear(time) === true) {	// 今年
            returnTime = formatDateTime(time)
                .substring(5, 16);
        } else if (timeDiffer > 86400000 && isYestday(time) === false && isYear(time) === false) { // 不属于今年
            returnTime = formatDateTime(time)
                .substring(0, 10);
        }
  
        return returnTime;
    }
  
    return timeChange(time);
};
/**
 * @description: 文件类型映射icon
 * @param {*} date
 * @param {*} details
 * @param {*} showWeek
 * @return {*}
 */
export const getFileIcon = (fileName:string):string => {
    const fileExtension:string = fileName.toLowerCase();
    // 定义文件类型与对应图标的映射关系
    const iconMap:Record<string, string> = {
        '.pdf': 'PDF.svg',
        '.doc': 'DOCX.svg',
        '.docx': 'DOCX.svg',
        '.xls': 'EXCEL.svg',
        '.xlsx': 'EXCEL.svg',
        '.png': 'IMAGE.svg',
        '.jpg': 'IMAGE.svg',
        '.jpeg': 'IMAGE.svg',
        '.gif': 'IMAGE.svg',
    };
    const icon:string=iconMap[fileExtension] || 'file.svg';
    return `/static/svg/fileType/${icon}`;
};

/**
 * @description: Encode
 * @param {*} str
 * @return {*}
 */
export const urlEncode = (str:string|number):string => {
    str = (str + '').toString();
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
};