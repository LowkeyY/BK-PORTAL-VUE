

/**
 * @description: 成绩状态
 */
export enum GradeEnums {
    PASSED= '合格',
    NO_PASS = '不合格',
}

/**
 * @description:  // tracking 0 未设置跟踪 1 手动 2自动
 * @return {*}
 */
export enum ResourceTracking {
    NONE= '0', 
    MANUAL = '1', // 需手动触发
    AUTO = '2', 
}

/**
 * @description: 考勤
 */
export enum AttendanceEnums {
    PASSED= '未达标',
    NO_PASS = '达标',
}