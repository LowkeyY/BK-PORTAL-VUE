
declare interface AssignParams {
    cmid:string|number,
    ssignId:string|number,
    courseid:string|number,
    userid:string|number
}

declare interface AssignCommentsParams {
    cmid:string|number,
    itemid:string|number,
    userid:string|number
}

declare interface saveAssignParams {
    onlinetext:string,
    assignmentid:string|number,
    filemanager?:string|number
}