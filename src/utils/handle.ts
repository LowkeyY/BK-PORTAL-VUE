/*
 * @Author: Lowkey
 * @Date: 2023-12-20 13:13:02
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 13:14:45
 * @FilePath: \BK-Portal-VUE\src\utils\handle.ts
 * @Description: 公共事件
 */
export function exceScript(func:string) {
    if (func) {
        try {
            eval(func);
        } catch (e) {
            console.log(e);
        }
    }
}