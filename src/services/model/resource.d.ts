
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

declare interface submitAssignParams {
    assignmentid:string|number,
}

declare interface pageParams {
    cmid:string,
    instance:string,
    courseid:string,
    userid:string,
    modname:string,
    pageid:string,
    coursename:string,
    userfullname:string,
    username:string,
    devicetype:string
}
declare interface svpParams {
    cmid:string,
    instance:string,
    courseid:string,
    userid:string,
    modname:string,
    chapterid:string,
    coursename:string,
    userfullname:string,
    username:string,
    devicetype:string
}