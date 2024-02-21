

export const getLiveCourseFilterList = (list: Array<any>, type: string) => {
    if(!type){
        return [];
    }
    if(type==='live'){
        return list.filter(item=>!item.playbackUrl);
    }else if(type==='playBack'){
        return list.filter(item=>item.playbackUrl);
    }else{
        return list.filter(item=>item.idNumber===type);
    }
};
