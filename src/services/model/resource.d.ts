

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

declare interface coursewareParams {
    coursewareID:string,
    userID:string,
    courseID:string,
}

declare interface addPlayInfoParams {
    coursewareID:string,
    sourceType:string,
    terminal:string,
    playStartTime:string|number,
    courseID:string,
    uID?:string,
    scenarioID?:string,
    userID:string
}

declare interface upDateFlowParams {
    playEndTime:string|number,
    userLearningFlowID:string,
}

declare interface mdlresStateParams {
    cmid:string,
    userid:string,
    courseid:string
}

declare interface folderParams {
    cmid:string,
    courseid:string
}

declare interface queryQuizParams {
    cmid:string,
    courseid:string,
    quizid:string,
    userid:string
}

declare interface queryQuizPageParams {
    quizid:string|number,
    attemptid?:string|number,
    page?:string|number
}

declare interface queryQuizNavigateParams {
    attemptid:string|number,
}

declare interface saveQuizParams {
    attemptid:string|number,
    timeup:string|number,
    finishattempt:string|number,

}

declare interface queryQuizReviewParams {
    attemptid:string|number,
}