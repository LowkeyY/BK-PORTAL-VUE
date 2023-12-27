/*
 * @Author: Lowkey
 * @Date: 2023-12-21 11:03:16
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-27 14:46:44
 * @FilePath: \BK-Portal-VUE\src\utils\constants.ts
 * @Description:
 */
import storage from './storage';


export const bkStudentGirds = [
    {
        id: '1',
        icon: 'academicProgress',
        text: '学业进度',
        appType: 'xyjd',
        // path: 'alert' // 临时弹窗
        path: 'oauth'
    },
    {
        id: '2',
        icon: 'schoolTimetable',
        text: '课程表',
        path: 'timetable'
    },
    {
        id: '3',
        icon:'paymentPlatform',
        text: '交费平台',
        path: 'payment'
    },
    
    {
        id: '4',
        icon: 'schoolCalendar',
        text: '校历',
        path: 'schoolCalendar',
        queryType: 'bkxl'
    },
    {
        id: '5',
        icon: 'myGrades',
        text: '我的成绩',
        path: 'achievement'
    },
    
    {
        id: '6',
        icon: 'myApplication',
        text: '我的申请',
        path: 'apply'
    },  
    {
        id: '7',
        icon: 'myAttendance',
        text: '我的考勤',
        path: 'attendance'
    },
    {
        id: '8',
        icon:'applyingForDegree',
        text: '申请学位',
        appType: 'xwsq',
        path: 'oauth'
    },
    {
        id: '9',
        icon: 'selected',
        text: '自主选课',
        appType: 'xkxx',
        // path: 'oauth'
        path: 'alert'
    },
    {
        id: '10',
        icon: 'suspendGraduation',
        text: '暂缓毕业',
        appType: 'zhby',
        path: 'oauth'
    },
    {
        id: '11',
        icon: 'liveClasses',
        text: '我的直播',
        path: 'liveCourse'
    },
    {
        id: '12',
        icon: 'calendar',
        text: '学生日历',
        path: 'timetable'
    },
    {
        id: '13',
        icon: 'plan',
        text: '培养方案',
        path: 'achievement'
    },
];

export const moreGird = {
    id: '99',
    icon: 'more',
    text: '更多',
    path: ''
};