/*
 * @Author: Lowkey
 * @Date: 2023-12-21 11:03:16
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-21 17:36:11
 * @FilePath: \BK-Portal-VUE\src\utils\constants.ts
 * @Description:
 */
import storage from './storage';


export const bkStudentGirds = [
    {
        id: '1',
        icon: require('themes/images/grids/progress.png'),
        text: '学业进度',
        appType: 'xyjd',
        // path: 'alert' // 临时弹窗
        path: 'oauth'
    },
    {
        id: '2',
        icon: require('themes/images/grids/timetable.png'),
        text: '课程表',
        path: 'timetable'
    },
    {
        id: '3',
        icon: require('../themes/images/grids/pay.png'),
        text: '交费平台',
        path: 'payment'
    },
    
    // { //删除
    //   id: '3',
    //   icon: require('themes/images/grids/graduationInformation.png'),
    //   text: '毕业信息',
    //   // path: 'graduationInformation'
    //   path: 'alert' // 临时弹窗
    // },
    {
        id: '4',
        icon: require('themes/images/grids/schoolCalendar.png'),
        text: '校历',
        path: 'schoolCalendar',
        queryType: 'bkxl'
    },
    {
        id: '5',
        icon: require('../themes/images/grids/achievement.png'),
        text: '我的成绩',
        path: 'achievement'
    },
    {
        id: '6',
        icon: require('themes/images/grids/collection.png'),
        text: '我的收藏',
        path: 'collection'
    },
    
    {
        id: '7',
        icon: require('themes/images/grids/apply.png'),
        text: '我的申请',
        path: 'apply'
    },
    {
        id: '8',
        icon: require('../themes/images/grids/group.png'),
        text: '我的小组',
        path: 'group'
    },
    {
        id: '9',
        icon: require('../themes/images/grids/teachers.png'),
        text: '我的老师',
        path: 'teachers'
    },
    
    {
        id: '10',
        icon: require('../themes/images/grids/attendance.png'),
        text: '我的考勤',
        path: 'attendance'
    },
    {
        id: '11',
        icon: require('../themes/images/grids/contacts.png'),
        text: '联系人',
        path: 'contacts'
    },
    {
        id: '12',
        // icon: require('themes/images/grids/graduationInformation.png'),
        icon: require('../themes/images/others/11.jpg'),
        text: '申请学位',
        appType: 'xwsq',
        path: 'oauth'
    },
    {
        id: '13',
        icon: require('../themes/images/others/13.jpg'),
        text: '自主选课',
        appType: 'xkxx',
        // path: 'oauth'
        path: 'alert'
    },
    {
        id: '14',
        icon: require('../themes/images/others/graduations.jpg'),
        text: '暂缓毕业',
        appType: 'zhby',
        path: 'oauth'
    },
    {
        id: '15',
        icon: require('../themes/images/grids/live.png'),
        text: '直播课',
        path: 'liveCourse'
    }
];