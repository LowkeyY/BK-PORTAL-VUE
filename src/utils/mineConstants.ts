/*
 * @Author: Lowkey
 * @Date: 2023-12-27 15:57:23
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-20 11:47:52
 * @FilePath: \BK-Portal-VUE\src\utils\mineConstants.ts
 * @Description: 
 */
export const bkMineGirds = [
    {
        id: '1',
        icon: 'myGroup',
        text: '我的小组',
        path: 'myGroups',
        auth: '',
    },
    {
        id: '2',
        icon: 'myTeacher',
        text: '我的老师',
        path: 'myTeachers',
        auth: '',
    },
    {
        id: '3',
        icon: 'contacts',
        text: '联系人',
        path: 'contacts',
        auth: '',
    },
    {
        id: '4',
        icon: 'myFeedback',
        text: '我的反馈',
        path: 'Suggestion',
        auth: '',
    },
    {
        id: '5',
        icon: 'collect',
        text: '收藏',
        path: 'myCollections',
        auth: '',
    },
];

export const bkMineInfo = [
    {
        id: '1',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'phone-filled',
        },
        text: '手机号',
        key: 'phone',
    },
    {
        id: '2',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'email-filled',
        },
        text: '邮箱',
        key: 'email',
    },
    {
        id: '3',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'staff-filled',
        },
        text: '民族',
        key: 'nation',
    },
    {
        id: '4',
        extraIcon: {
            color: '#918d8d',
            size: '22',
            type: 'person-filled',
        },
        text: '性别',
        key: 'gender',
    },
];
