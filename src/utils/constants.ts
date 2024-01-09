/*
 * @Author: Lowkey
 * @Date: 2023-12-21 11:03:16
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-09 15:59:30
 * @FilePath: \BK-Portal-VUE\src\utils\constants.ts
 * @Description:
 */
import storage from './storage';


export const bkStudentGirds:Grids[] = [
    {
        id: '1',
        icon: 'academicProgress',
        text: '学业进度',
        appType: 'xyjd',
        // path: 'alert' // 临时弹窗
        path: 'oauth'   // 路由name oauth为单点登录集成
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
        queryKey: 'bkxl'
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
    path: 'menuManagement'
};

export const resourceType:Record<string,string> = {
    resource: '文件',
    label: '标签',
    url: '网页地址',
    page: '网页',
    forumng: '北开讨论区',
    forum: '讨论区',
    quiz: '测验',
    assign: '作业',
    svp: 'SVP学伴视频',
    feedback: '反馈',
    superclassplayer: '超级播放系统',
    bjoupage: '互动网页',
    folder: '文件夹',
    scorm: 'SCORM课件',
    ouwiki: 'OU维基',
    book: '图书',
    mindmap: '思维导图',
    data: '数据库',
    choice: '投票',
    lesson: '程序教学',
    chat: '聊天',
    wiki: 'Wiki协作',
    glossary: '词汇表',
    survey: '调查问卷',
    workshop: '互动评价',
    lti: '外部工具'
};