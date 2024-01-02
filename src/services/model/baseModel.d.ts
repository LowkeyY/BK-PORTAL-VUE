/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-21 14:25:05
 * @FilePath: \BK-Portal-VUE\src\services\model\baseModel.d.ts
 * @Description:
 */
declare interface MoodleBaseInfoParams {
    token: string;
    userId:string
}

declare interface MessageCountsParams {
    userId:string|number
}

declare interface courseListParams {
    userId:string;
    value: string;
}
