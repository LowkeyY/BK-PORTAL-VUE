
declare interface MoodleBaseInfoParams {
    token: string;
    userId:string
}

declare interface MessageCountsParams {
    userid:string|number
}

declare interface courseListParams {
    userId:string;
    value: string;
}

declare interface CourseContentParams {
    userid:string;
    courseid: string;
    coursename:string;
    userfullname: string;
    username:string;
    devicetype: string;
}

declare interface SetGridsParams {
    userConfig:string,
    userId:string|number
}

declare interface SetPageParams {
    currentPage:number,
    pageSize:number
}
