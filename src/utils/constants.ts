/* eslint-disable camelcase */
/*
 * @Author: Lowkey
 * @Date: 2023-12-21 11:03:16
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 15:37:36
 * @FilePath: \BK-Portal-VUE\src\utils\constants.ts
 * @Description:
 */

export const oauthUrl: Record<string, any> = {
    // 学业进度
    academicProgress: 'http://jwgl.bjou.edu.cn/sso/jzOauthLogin?&ljdz=xsxy%2Fxsxyqk_cxXsxyqkIndex.html%3Fgnmkdm%3DN105515%26layout%3Ddefault',
    // 学位申请
    applyingForDegree: 'http://jwgl.bjou.edu.cn/sso/jzOauthLogin?&ljdz=bygl%2Fxwsqgl_cxXwsqIndex.html%3Fgnmkdm%3DN553510%26layout%3Ddefault',
    // 自主选课
    selected: 'http://jwgl.bjou.edu.cn/sso/jzOauthLogin?&ljdz=xsxk%2Fzzxklbb_cxZzxkLbbIndex.html%3Fgnmkdm%3DN253512%26layout%3Ddefault',
    // 暂缓毕业
    suspendGraduation: 'http://jwgl.bjou.edu.cn/sso/jzOauthLogin?&ljdz=bygl%2Fzhbygl_cxZhbysqIndex.html%3Fgnmkdm%3DN553010%26layout%3Ddefault',
    // 缴费系统
    payment: 'https://bjkfdx.mp.sinojy.cn/api/user/loginByInterface',
};
// export const bkStudentGirds:Grids[] = [
//     {
//         id: '1',
//         icon: 'plan',
//         text: '教学导航',
//         appType: 'academicProgress',
//         // path: 'alert' // 临时弹窗
//         path: 'oauth'   // 路由name oauth为单点登录集成
//     },
//     {
//         id: '2',
//         icon: 'schoolTimetable',
//         text: '开课大表',
//         path: 'timetable'
//     },
//     {
//         id: '3',
//         icon:'paymentPlatform',
//         text: '交费平台',
//         path: 'payment'
//     },

//     {
//         id: '4',
//         icon: 'schoolCalendar',
//         text: '校历',
//         path: 'schoolCalendar',
//         queryKey: 'bkxl'
//     },
//     {
//         id: '5',
//         icon: 'calendar',
//         text: '教师日历',
//         path: 'achievement'
//     },

//     // {
//     //     id: '6',
//     //     icon: 'myApplication',
//     //     text: '我的申请',
//     //     path: 'apply'
//     // },
//     // {
//     //     id: '7',
//     //     icon: 'myAttendance',
//     //     text: '我的考勤',
//     //     path: 'attendance'
//     // },
//     {
//         id: '8',
//         icon:'contacts',
//         text: '联系人',
//         appType: 'applyingForDegree',
//         path: 'oauth'
//     },
//     // {
//     //     id: '9',
//     //     icon: 'selected',
//     //     text: '自主选课',
//     //     appType: 'selected',
//     //     // path: 'oauth'
//     //     path: 'alert'
//     // },
//     {
//         id: '10',
//         icon: 'feedback',
//         text: '意见反馈',
//         appType: 'suspendGraduation',
//         path: 'oauth'
//     },
//     // {
//     //     id: '11',
//     //     icon: 'liveClasses',
//     //     text: '我的直播',
//     //     path: 'liveCourse'
//     // },
//     // {
//     //     id: '12',
//     //     icon: 'calendar',
//     //     text: '学生日历',
//     //     path: 'timetable'
//     // },
//     {
//         id: '13',
//         icon: 'plan',
//         text: '培养方案',
//         path: 'achievement'
//     },
// ];
export const bkStudentGirds: Grids[] = [
    {
        id: '1',
        icon: 'academicProgress',
        text: '学业进度',
        appType: 'academicProgress',
        // path: 'alert' // 临时弹窗
        path: 'oauth', // 路由name oauth为单点登录集成
    },
    {
        id: '2',
        icon: 'schoolTimetable',
        text: '课程表',
        path: 'timetable',
    },
    {
        id: '3',
        icon: 'paymentPlatform',
        text: '缴费平台',
        path: 'payment',
    },

    {
        id: '4',
        icon: 'schoolCalendar',
        text: '校历',
        path: 'schoolCalendar',
        queryKey: 'bkxl',
    },
    {
        id: '5',
        icon: 'myGrades',
        text: '我的成绩',
        path: 'achievement',
    },

    {
        id: '6',
        icon: 'myApplication',
        text: '我的申请',
        path: 'apply',
    },
    {
        id: '7',
        icon: 'myAttendance',
        text: '我的考勤',
        path: 'attendance',
    },
    {
        id: '8',
        icon: 'applyingForDegree',
        text: '申请学位',
        appType: 'applyingForDegree',
        path: 'oauth',
    },
    {
        id: '9',
        icon: 'selected',
        text: '自主选课',
        appType: 'selected',
        // path: 'oauth'
        path: 'alert',
    },
    {
        id: '10',
        icon: 'suspendGraduation',
        text: '暂缓毕业',
        appType: 'suspendGraduation',
        path: 'oauth',
    },
    {
        id: '11',
        icon: 'liveClasses',
        text: '我的直播',
        path: 'liveCourse',
    },
    {
        id: '12',
        icon: 'plan',
        text: '培养方案',
        path: 'achievement',
    },
    {
        id: '13',
        icon: 'deal',
        text: '我的办理',
        path: 'dealWith',
    },
];

export const gkStudentGirds = [
    // {
    //     id: '1',
    //     icon:'studentStatusGK',
    //     text: '学籍信息',
    //     path: 'studentStatusGK'
    // },
    {
        id: '2',
        icon: 'examinationGK',
        text: '考试成绩',
        path: 'Examination',
    },
    {
        id: '3',
        icon: 'courseGK',
        text: '已选课程',
        path: 'OuchnCourse',
    },
    {
        id: '4',
        icon: 'schoolCalendarGK',
        text: '历年试题',
        path: 'OuchnList',
        queryType: 'gklnst',
    },
    {
        id: '5',
        icon: 'archivesGK',
        text: '常见问题',
        path: 'OuchnList',
        queryType: 'gkcjwt',
    },
    {
        id: '6',
        icon: 'archivesGK',
        text: '我的课表',
        path: 'OuchnList',
        queryType: 'gkcjwt',
    },
    {
        id: '7',
        icon: 'archivesGK',
        text: '注册课程',
        path: 'OuchnList',
        queryType: 'gkcjwt',
    },
    {
        id: '8',
        icon: 'archivesGK',
        text: '考试安排',
        path: 'OuchnList',
        queryType: 'gkcjwt',
    },
    {
        id: '9',
        icon: 'archivesGK',
        text: '考试成绩',
        path: 'OuchnList',
        queryType: 'gkcjwt',
    },
];

export const moreGird = {
    id: '99',
    icon: 'more',
    text: '更多',
    path: 'menuManagement',
};


export const teacherPortalGirds: any[] = [
    {
        id: '2',
        text: '通知公告',
        icon:'/static/images/teacherGrids/notice.png',
        path: '',
    },
    {
        id: '4',
        text: '校历',
        icon:'/static/images/teacherGrids/schoolCalendar.png',
        path: 'oauth'
    },
    {
        id: '5',
        text: '意见反馈',
        icon:'/static/images/teacherGrids/feedback.png',
        path: 'oauth',
    },
    {
        id: '6',
        text: '规章制度',
        icon:'/static/images/teacherGrids/regulations.png',
        path: 'oauth',
    },
    {
        id: '8',
        text: '常用文档',
        icon:'/static/images/teacherGrids/file.png',
        path: 'oauth',
    },
    {
        id: '9',
        text: '问卷调查',
        icon:'/static/images/teacherGrids/questionnaire.png',
        path: 'oauth',
    },
];

export const teacherGirds = [
    {
        id: '1',
        icon:'lessons',
        text: '课程',
        path: 'TeacherLessons'
    },
    {
        id: '2',
        icon: 'report',
        text: '报表查询',
        path: 'EduReport',
    },
    {
        id: '3',
        icon: 'addressBook',
        text: '联系人',
        path: '',
    },
];

export const resourceType: Record<string, string> = {
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
    lti: '外部工具',
};

export const allowFileTypes: Record<string, any> = {
    archive: {
        name: '存档文件',
        value: ['.7z', '.bdoc', '.cdoc', '.ddoc', '.gtar', '.tgz', '.gz', '.gzip', '.hqx', '.rar', '.sit', '.tar', '.zip'],
    },
    spreadsheet: {
        name: '电子表格文件',
        value: ['.csv', '.gsheet', '.ods', '.ots', '.xls', '.xlsx', '.xlsm'],
    },
    html_video: {
        name: '浏览器支持的视频文件',
        value: ['.fmp4', '.mov', '.mp4', '.m4v', '.ogv', '.webm'],
    },
    html_audio: {
        name: '浏览器支持的音频文件',
        value: ['.aac', '.flac', '.mp3', '.m4a', '.oga', '.ogg', '.wav'],
    },
    media_source: {
        name: '流媒体',
        value: ['.m3u8', '.mpd'],
    },
    video: {
        name: '视频文件',
        value: [
            '.3gp',
            '.avi',
            '.dv',
            '.dif',
            '.flv',
            '.f4v',
            '.fmp4',
            '.mov',
            '.movie',
            '.mp4',
            '.mpeg',
            '.mpe',
            '.mpg',
            '.ogv',
            '.qt',
            '.rmvb',
            '.rv',
            '.swf',
            '.swfl',
            '.ts',
            '.webm',
            '.wmv',
            '.asf',
        ],
    },
    image: {
        name: '图像文件',
        value: ['.ai', '.bmp', '.gdraw', '.gif', '.ico', '.jpe', '.jpeg', '.jpg', '.pct', '.pic', '.pict', '.png', '.svg', '.svgz', '.tif', '.tiff'],
    },
    web_video: {
        name: '网络上使用的视频文件',
        value: ['.avi', '.flv', '.f4v', '.fmp4', '.mov', '.mp4', '.m4v', '.mpeg', '.mpe', '.mpg', '.ogv', '.qt', '.swf', '.swfl', '.ts', '.webm'],
    },
    web_image: {
        name: '网络上使用的图像文件',
        value: ['.gif', '.jpe', '.jpeg', '.jpg', '.png', '.svg', '.svgz'],
    },
    web_audio: {
        name: '网络上使用的音频文件',
        value: ['.aac', '.flac', '.mp3', '.m4a', '.oga', '.ogg', '.ra', '.wav'],
    },
    web_file: {
        name: '网络文件',
        value: ['.css', '.html', '.xhtml', '.htm', '.js', '.scss'],
    },
    document: {
        name: '文档文件',
        value: ['.doc', '.docx', '.epub', '.gdoc', '.odt', '.ott', '.oth', '.pdf', '.rtf'],
    },
    presentation: {
        name: '演示文稿',
        value: ['.gslides', '.odp', '.otp', '.pps', '.ppt', '.pptx', '.pptm', '.potx', '.potm', '.ppam', '.ppsx', '.ppsm', '.pub', '.sxi', '.sti'],
    },
    optimised_image: {
        name: '要优化的图像文件，例如徽章',
        value: ['.gif', '.jpe', '.jpeg', '.jpg', '.png'],
    },
    audio: {
        name: '音频文件',
        value: ['.aac', '.aif', '.aiff', '.aifc', '.au', '.flac', '.m3u', '.mp3', '.m4a', '.ogg', '.ra', '.wav', '.rm', '.wav', '.wma'],
    },
    html_track: {
        name: 'HTML 跟踪文件',
        value: ['.vtt'],
    },
};

export const defaultHtmlStyles = {
    h1: 'margin: 0.1em 0 !important; font-size: 36rpx;',
    h2: 'margin: 0.1em 0 !important; font-size: 34rpx;',
    h3: 'margin: 0.1em 0 !important; font-size: 32rpx;',
    h4: 'margin: 0.1em 0 !important; font-size: 30rpx;',
    h5: 'margin: 0.1em 0 !important; font-size: 28rpx;',
    h6: 'margin: 0.1em 0 !important; font-size: 26rpx;',
    span: 'font-size:26rpx !important;',
    strong: 'font-size: 28rpx !important;',
    p: 'font-size: 26rpx !important;',
    a: 'font-size: 26rpx !important;',
    div: 'max-width: 100% !important;padding-left: 0 !important; margin-left: 0 !important;',
    ul: 'padding: 0 0 0 1em;margin: 0.1em 0 !important;font-size: 26rpx;',
    ol: 'padding: 0 0 0 1em;margin: 0.1em 0 !important;font-size: 26rpx;',
    li: 'padding: 0;font-size:26rpx;',
    img: 'max-width: 100% !important; max-height: 100% !important;height: auto !important;',
    table: 'height:auto !important;',
};

export const availabilityinfoHtmlStyles = {
    h1: 'margin: 0; font-size: 24rpx;',
    h2: 'margin: 0; font-size: 24rpx;',
    h3: 'margin: 0; font-size: 24rpx;',
    h4: 'margin: 0; font-size: 24rpx;',
    h5: 'margin: 0; font-size: 24rpx;',
    h6: 'margin: 0; font-size: 24rpx;',
    span: 'font-size:24rpx',
    strong: 'font-size: 24rpx !important;',
    p: 'margin: 0;font-size: 24rpx;',
    a: 'font-size: 24rpx;',
    ul: 'padding: 0 0 0 1em;margin: 0.1em 0 !important;font-size: 24rpx;',
};

export const bkStudentTabBar = [
    {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '/static/images/tabBar/homePage.png',
        selectedIconPath: '/static/images/tabBar/homePage-o.png',
    },
    {
        pagePath: 'pages/lessons/index',
        text: '课程',
        iconPath: '/static/images/tabBar/lesson.png',
        selectedIconPath: '/static/images/tabBar/lesson-o.png',
    },
    {
        pagePath: 'pages/bjouSchedule/index',
        text: '学生日历',
        iconPath: '/static/images/tabBar/schedule.png',
        selectedIconPath: '/static/images/tabBar/schedule-o.png',
    },
    {
        pagePath: 'pages/notifications/index',
        text: '通知·制度',
        iconPath: '/static/images/tabBar/notice.png',
        selectedIconPath: '/static/images/tabBar/notice-o.png',
    },
    {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: '/static/images/tabBar/mine.png',
        selectedIconPath: '/static/images/tabBar/mine-o.png',
    },
];

export const gkStudentTabBar = [
    {
        pagePath: 'pageOuchn/index/index',
        text: '首页',
        iconPath: '/static/images/tabBar/homePage.png',
        selectedIconPath: '/static/images/tabBar/homePage-o.png',
    },
    {
        pagePath: 'pages/notifications/index',
        text: '通知',
        iconPath: '/static/images/tabBar/notice.png',
        selectedIconPath: '/static/images/tabBar/notice-o.png',
    },
    {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: '/static/images/tabBar/mine.png',
        selectedIconPath: '/static/images/tabBar/mine-o.png',
    },
];

export const teacherTabBar = [
    {
        pagePath: 'pageTeacher/index/index',
        text: '首页',
        iconPath: '/static/images/tabBar/homePage.png',
        selectedIconPath: '/static/images/tabBar/homePage-o.png',
    },
    {
        pagePath: 'pageTeacher/moodle/index',
        text: '学习平台',
        iconPath: '/static/images/tabBar/moodle.png',
        selectedIconPath: '/static/images/tabBar/moodle-o.png',
    },
    {
        pagePath: 'pageTeacher/teacherLiveCourse/index',
        text: '直播课程',
        iconPath: '/static/images/tabBar/live.png',
        selectedIconPath: '/static/images/tabBar/live-o.png',
    },
    {
        pagePath: 'pageTeacher/teacherSchedule/index',
        text: '教师日历',
        iconPath: '/static/images/tabBar/schedule.png',
        selectedIconPath: '/static/images/tabBar/schedule-o.png',
    },
    {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: '/static/images/tabBar/mine.png',
        selectedIconPath: '/static/images/tabBar/mine-o.png',
    },
];

export const reportList = [
    {
        name: '学习平台考勤周报',
        path: 'attendanceReportWeekly',
    },
    {
        name: '学习平台考勤统计',
        path: 'attendanceReportStatistics',
    },
    {
        name: '辅导教师回帖情况统计',
        path: 'ReplySituation',
    },
    {
        name: '辅导教师辅导情况',
        path: 'ReplySituation',
    },
    {
        name: '辅导教师评分情况统计',
        path: 'RatingSituation',
    },
    {
        name: '直播课堂统计',
        path: 'LiveCourseReport',
    },
];


export const afterReportList = [
    {
        name: '结课报告',
        path: 'lessonEndingReport',
    },
    {
        name: '辅导教师结课报告',
        path: 'lessonEndingReport',
    },
];
