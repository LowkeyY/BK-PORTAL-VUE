
interface Grids {
    id: string,
    icon: string, // svg图标
    text:string, //名称
    appType?: string, // 集成系统名称
    queryKey?:string, // 跳转后请求接口参数
    path: string,   // 路由name oauth为单点登录集成
}