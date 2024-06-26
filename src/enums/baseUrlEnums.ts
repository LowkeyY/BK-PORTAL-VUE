/*
 * @Author: Lowkey
 * @Date: 2023-12-14 16:51:24
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-17 11:20:24
 * @FilePath: \BK-Portal-VUE\src\enums\baseUrlEnums.ts
 * @Description: 定义BaseURL常量
 */

// 生产环境
export enum prodBaseUrlEnums {
    // 学生门户（世纪金正）
    PORTAL_SERVER ='https://stuportal.bjou.edu.cn',
    // 公司接口
    CUNOVS_SERVER='http://elearningapp.bjou.edu.cn:8080',
    // 学习平台 （学伴科技）
    MOODLE_SERVER='https://elearning.bjou.edu.cn',
    // APP管理平台 （本公司）
    MANAGE_SERVER='http://elearningapp.bjou.edu.cn:9200',
    // 统一认证 （世纪金正）
    SSO_SERVER='https://sso.bjou.edu.cn',
    // 资源管理平台 （世纪金正）
    RESOURE_SERVER='https://resm.bjou.edu.cn',
    MDLRES_SERVER=''
}

// 学校测试环境
export enum devBaseUrlEnums {
      // 学生门户（世纪金正）
      PORTAL_SERVER ='https://stuportal.bjou.edu.cn',
    //   PORTAL_SERVER ='https://teststuportal.bjou.edu.cn',
      // 公司接口
      CUNOVS_SERVER='http://etestapp.bjou.edu.cn:8080',
      // 学习平台 （学伴科技）
      MOODLE_SERVER='https://etest.bjou.edu.cn',
      // APP管理平台 （本公司）
      MANAGE_SERVER='http://elearningapp.bjou.edu.cn:9200',
      // 统一认证 （世纪金正）
    //   SSO_SERVER='https://testsso.bjou.edu.cn',
    SSO_SERVER='https://sso.bjou.edu.cn',
      // 资源管理平台 （世纪金正）
      RESOURE_SERVER='https://testresm.bjou.edu.cn',
    //   MDLRES_SERVER = 'http://etestapp.bjou.edu.cn:9000/cnvresm',
      MDLRES_SERVER=''
}



