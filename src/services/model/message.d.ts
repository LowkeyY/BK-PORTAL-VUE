

declare interface ActivityMessageParams {
    userId:string|number;
    nowPage?:string|number
}

declare interface PrivateMessageParams {
    userId:string|number;

}

declare interface MessageConversationParams {
    userId:string|number;
    fromuserid:string|number;
    nowpage:string|number;
}
