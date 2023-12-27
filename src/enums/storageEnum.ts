/*
 * @Author: Lowkey
 * @Date: 2023-12-18 16:27:54
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 15:05:32
 * @FilePath: \BK-Portal-VUE\src\enums\storageEnum.ts
 * @Description: 
 */
export enum StorageEnum {
    ACCOUNT = 'account', // 登录账号：学号或手机号
    CREDENTIAL ='credential', // 明文密码用于集成
    PORTAL_TOKEN='portalToken',// 学习平台tonken
    ORG_CODE = 'orgCode', // 学生身份标识 bjou_student：北开
    PORTAL_USER_ID = 'portalUserId', //门户用户ID
    USER_CODE = 'userCode', 
    MOODLE_USER_ID = 'moodleUserId', // 学习平台用户ID
    MOODLE_TOKEN= 'moodleToken', // 学习平台Token
    USER_LOGIN_ID = 'userLoginId',
    GRIDS_SORT = 'gridsSort' // 菜单排序
}