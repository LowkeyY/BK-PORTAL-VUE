/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-26 19:40:33
 * @FilePath: \BK-Portal-VUE\src\utils\index.ts
 * @Description:
 */
import storage from './storage';
import { isObject } from '@/utils/is';
import { StorageEnum } from '@/enums/storageEnum';
import { UserRoleEnums } from '@/enums/appEnum';
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
    return storage.get(StorageEnum.ORG_CODE) === UserRoleEnums.BJOU_STUDENT;
}

/**
 * @description: 是否是国开用户
 * @return {*}
 */
export function isOuchnUser(): boolean {
    return storage.get(StorageEnum.ORG_CODE) === UserRoleEnums.OUCHN_STUDENT;
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
 * @description: 默认图片
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

export const getErrorImg = (el: any, type = 'default') => {
    if (el && el.target) {
        if (type !== 'user') {
            el.target.src = defaultImg;
            el.target.onerror = null;
        } else {
            el.target.src = defaultUserIcon;
            el.target.onerror = null;
        }
    }
};

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
export const getCommonDate = (date: number, details = true, showWeek = true): string => {
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
 * @description: 作业间隔时间
 * @param {*} data
 * @param {*} state
 * @param {*} timemodified
 * @return {*}
 */
export const getSurplusDay = (data: number, state: string, timemodified = 0) => {
    const now = new Date().getTime();
    const getDays = (time: number) => {
        const days = time / 1000 / 60 / 60 / 24;
        const daysRound = Math.floor(days);
        const hours = time / 1000 / 60 / 60 - 24 * daysRound;
        const hoursRound = Math.floor(hours);
        const minutes = time / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
        const minutesRound = Math.floor(minutes);
        // const seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        return `${daysRound > 0 ? `${daysRound}天` : ''}${hoursRound > 0 ? `${hoursRound}小时` : ''}${minutesRound}分钟`;
    };
    if (state === 'submitted') {
        const nowTime = data * 1000 - now;
        if (data * 1000 > now) {
            return getDays(nowTime);
        }
        if (data > timemodified) {
            const time = (data - timemodified) * 1000;
            return `提早了${getDays(time)}提交`;
        }
        const time = timemodified * 1000 - data * 1000;
        return `推迟了${getDays(time)}提交`;
    }
    if (data * 1000 > now) {
        const time = data * 1000 - now;
        return getDays(time);
    }
    return '作业已截止';
};

/**
 * @description: 聊天时间转换
 * @param {*} timeValue
 * @return {*}
 */
export const getMessageTime = (timeValue: number): string => {
    const time: number = timeValue * 1000;

    function formatDateTime(time: number): string {
        const date = new Date(time);
        const y = date.getFullYear();
        let m: string | number = date.getMonth() + 1;
        m = m < 10 ? `0${m}` : m;
        let d: string | number = date.getDate();
        d = d < 10 ? `0${d}` : d;
        let h: string | number = date.getHours();
        h = h < 10 ? `0${h}` : h;
        let minute: string | number = date.getMinutes();
        let second: string | number = date.getSeconds();
        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;
        return `${y}-${m}-${d} ${h}:${minute}:${second}`;
    }

    // 判断传入日期是否为昨天
    function isYestday(time: number) {
        const date = new Date(); // 当前时间
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
        const yestday = new Date(today - 24 * 3600 * 1000).getTime();
        return time < today && yestday <= time;
    }

    // 判断传入日期是否属于今年
    function isYear(time: number) {
        const takeNewYear = new Date().getFullYear().toString(); // 当前时间的年份
        const takeTimeValue = formatDateTime(time).substring(0, 4); // 传入时间的年份
        return takeTimeValue === takeNewYear;
    }

    // 60000 1分钟
    // 3600000 1小时
    // 86400000 24小时
    // 对传入时间进行时间转换
    function timeChange(time: number) {
        const timeNew = new Date().getTime(); // 当前时间
        const timeDiffer = timeNew - time; // 与当前时间误差
        let returnTime = '';

        if (timeDiffer <= 60000) {
            // 一分钟内
            returnTime = '刚刚';
        } else if (timeDiffer > 60000 && timeDiffer < 3600000) {
            // 1小时内
            returnTime = `${Math.floor(timeDiffer / 60000)}分钟前`;
        } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(time) === false) {
            // 今日
            returnTime = formatDateTime(time).substring(11, 16);
        } else if (timeDiffer > 3600000 && isYestday(time) === true) {
            // 昨天
            returnTime = `昨天${formatDateTime(time).substring(11, 16)}`;
        } else if (timeDiffer > 86400000 && isYestday(time) === false && isYear(time) === true) {
            // 今年
            returnTime = formatDateTime(time).substring(5, 16);
        } else if (timeDiffer > 86400000 && isYestday(time) === false && isYear(time) === false) {
            // 不属于今年
            returnTime = formatDateTime(time).substring(0, 10);
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
export const getFileIcon = (fileName: string): string => {
    // const fileExtension:string = fileName.toLowerCase();
    // 定义文件类型与对应图标的映射关系
    // const iconMap:Record<string, string> = {
    //     '.pdf': 'PDF.svg',
    //     '.doc': 'DOCX.svg',
    //     '.docx': 'DOCX.svg',
    //     '.xls': 'EXCEL.svg',
    //     '.xlsx': 'EXCEL.svg',
    //     '.png': 'IMAGE.svg',
    //     '.jpg': 'IMAGE.svg',
    //     '.jpeg': 'IMAGE.svg',
    //     '.gif': 'IMAGE.svg',
    // };
    const pdfReg = /\.pdf$/i;
    const wordReg = /\.docx?$/i;
    const excelReg = /\.xlsx?$/i;
    const imageReg = /\.(jpg|jpeg|png|gif|bmp)$/i;
    const rarReg = /\.(zip|rar|7z)$/i;
    const fileExtension = () => {
        if (pdfReg.test(fileName)) {
            return 'PDF.svg';
        } else if (wordReg.test(fileName)) {
            return 'DOCX.svg';
        } else if (excelReg.test(fileName)) {
            return 'EXCEL.svg';
        } else if (imageReg.test(fileName)) {
            return 'IMAGE.svg';
        } else if (rarReg.test(fileName)) {
            return 'RAR.svg';
        } else {
            return 'file.svg';
        }
    };
    const icon: string = fileExtension();
    return `/static/svg/fileType/${icon}`;
};

/**
 * @description: 本地任务图标
 * @param {string} type
 * @return {*}
 */
export const getTaskIcon = (type: string) => {
    if (type === 'assign') {
        return '/static/svg/resourceIcon/homework.svg';
    } else if (type === 'quiz') {
        return '/static/svg/resourceIcon/test.svg';
    } else if (type === 'forum') {
        return '/static/svg/resourceIcon/huodong.svg';
    }
    return '';
};

/**
 * @description: Encode
 * @param {*} str
 * @return {*}
 */
export const urlEncode = (str: string | number): string => {
    str = (str + '').toString();
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
};

/**
 * @description:
 * @param {*} type
 * @return {*}
 */
export const pattern = (type: string) => {
    const obj = {
        href: /[a-zA-z]+:\/\/[^\\">]*/g,
        svg: /mymobile/gi,
        phone: /^1\d{10}$/,
        // eslint-disable-next-line no-useless-escape
        email: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
        zip: /\.zip|.rar|.7z$/i,
    };
    return obj[type];
};

/**
 * @description: 转换中文
 * @param {*} num
 * @return {*}
 */
export const toChineseNum = (num: number) => {
    const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    // const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
    const chnUnitChar = ['', '十', '百', '千'];
    let strIns = '',
        chnStr = '';
    let unitPos = 0;
    let zero = true;
    while (num > 0) {
        const v = num % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        num = Math.floor(num / 10);
    }
    return `[第${chnStr}场]`;
};

/**
 * @description: 考勤时间
 * @param {*} timeValue
 * @return {*}
 */
export const getAttendanceTime = (timeValue: number): string => {
    const time: number = timeValue * 1000;

    function formatDateTime(time: number): string {
        const date = new Date(time);
        const y = date.getFullYear();
        let m: string | number = date.getMonth() + 1;
        m = m < 10 ? `0${m}` : m;
        let d: string | number = date.getDate();
        d = d < 10 ? `0${d}` : d;
        let h: string | number = date.getHours();
        h = h < 10 ? `0${h}` : h;
        let minute: string | number = date.getMinutes();
        let second: string | number = date.getSeconds();
        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;
        return `${y}-${m}-${d} ${h}:${minute}:${second}`;
    }

    // 判断传入日期是否为昨天
    function isYestday(time: number) {
        const date = new Date(); // 当前时间
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
        const yestday = new Date(today - 24 * 3600 * 1000).getTime();
        return time < today && yestday <= time;
    }

    // 60000 1分钟
    // 3600000 1小时
    // 86400000 24小时
    // 对传入时间进行时间转换
    function timeChange(time: number) {
        const timeNew = Date.parse(new Date()); // 当前时间
        const timeDiffer = timeNew - time; // 与当前时间误差
        let returnTime = {};

        if (timeDiffer <= 120000) {
            // 一分钟内
            returnTime = {
                time: '刚刚',
                color: '#00bd06',
            };
        } else if (timeDiffer > 120000 && timeDiffer < 300000) {
            // 1-5分钟
            returnTime = {
                time: `${Math.floor(timeDiffer / 60000)}分钟前`,
                color: '#ffa22f',
            };
        } else if (timeDiffer > 300000 && timeDiffer < 600000) {
            // 5-10
            returnTime = {
                time: `${Math.floor(timeDiffer / 60000)}分钟前`,
                color: '#ffa22f',
            };
        } else if (timeDiffer > 600000 && timeDiffer < 3600000) {
            // 1小时内
            returnTime = {
                time: `${Math.floor(timeDiffer / 60000)}分钟前`,
                color: '#ff2222',
            };
        } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(time) === false) {
            // 今日
            returnTime = {
                time: formatDateTime(time).substr(11, 5),
                color: '#ff2222',
            };
        } else if (timeDiffer > 3600000 && isYestday(time) === true) {
            // 昨天
            returnTime = {
                time: `昨天${formatDateTime(time).substr(11, 5)}`,
                color: '#ff2222',
            };
        } else if (timeDiffer > 86400000 && isYestday(time) === false) {
            returnTime = {
                time: formatDateTime(time),
                color: '#ff2222',
            };
        }

        return returnTime;
    }

    return timeChange(time);
};

/**
 * @description:  计算日期差
 * @param {number} start
 * @param {number} end
 * @return {*}
 */
export const getDurationTime = (start: number, end: number) => {
    const time = (end - start) * 1000;
    const days = time / 1000 / 60 / 60 / 24;
    const daysRound = Math.floor(days);
    const hours = time / 1000 / 60 / 60 - 24 * daysRound;
    const hoursRound = Math.floor(hours);
    const minutes = time / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
    const minutesRound = Math.floor(minutes);
    const seconds = time / 1000 - 24 * 60 * 60 * daysRound - 60 * 60 * hoursRound - 60 * minutesRound;
    return `${daysRound > 0 ? `${daysRound}天` : ''}${hoursRound > 0 ? `${hoursRound}小时` : ''}${minutesRound > 0 ? `${minutesRound}分钟` : ''}${seconds}秒`;
};

/**
 * @description:
 * @param {*} fileSize
 * @return {*}
 */
export const renderFileSize = (fileSize: number) => {
    if (fileSize < 1024) {
        return `${fileSize}B`;
    } else if (fileSize < 1024 * 1024) {
        let temp: number | string = fileSize / 1024;
        temp = temp.toFixed(2);
        return `${temp}KB`;
    } else if (fileSize < 1024 * 1024 * 1024) {
        let temp: number | string = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return `${temp}MB`;
    }
    let temp: number | string = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return `${temp}GB`;
};

/**
 * @description: 获取页面参数
 * @return {*}
 */
export const getCurPageParam = () => {
    const pages = getCurrentPages();
    const curPage: any = pages[pages.length - 1];
    const curParam = curPage.$page.options || curPage.$route.query; // h5:curPage.$route.query
  
    return curParam;
};

/**
 * @description: 解析JSON数据
 * @param {any} res
 * @return {*}
 */
export const parseJSON = (res: any) => {
    try {
        return JSON.parse(res);
    } catch (e) {
        return res;
    }
};

/**
 * 任务列表时间转换
 * @param date
 * @returns {string}
 */
export const isToday = (date: number): boolean => {
    if (date) {
        const currentDate = new Date();
        const lessonDate = new Date(date * 1000);
        if (currentDate.toDateString() <= lessonDate.toDateString()) {
            return true;
        }
        return false;
    }
    return false;
};

/**
 * @description: 根据ID查询课程名称
 * @param {any} course
 * @param {string} id
 * @return {*}
 */
export const findNameByCourses = (course: any[], id: string) => {
    let name = '';
    if (id && course.length) {
        const selectedCourse: any = course.filter((c: any) => c.id === id);
        name = selectedCourse.length ? (selectedCourse[0] || {}).fullname : '';
    }
    return name || '';
};

/**
 * @description: 发帖次数限制
 * @param {number} num
 * @return {*}
 */
export const getDurationDay = (num: number) => {
    const days: number = num / 60 / 60 / 24;
    const daysRound: number = Math.floor(days);
    return daysRound >= 7 ? '一周' : `${daysRound}天`;
};

/**
 * @description: 转换内存
 * @param {number} fileSize
 * @return {*}
 */
export const renderSize = (fileSize: number) => {
    if (fileSize < 1024) {
        return `${fileSize}B`;
    } else if (fileSize < 1024 * 1024) {
        const temp = (fileSize / 1024).toFixed(2);
        return `${temp}KB`;
    } else if (fileSize < 1024 * 1024 * 1024) {
        const temp = (fileSize / (1024 * 1024)).toFixed(2);
        return `${temp}MB`;
    }
    const temp = (fileSize / (1024 * 1024 * 1024)).toFixed(2);
    return `${temp}GB`;
};
