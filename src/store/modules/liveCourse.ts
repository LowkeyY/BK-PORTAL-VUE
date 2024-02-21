import {defineStore} from 'pinia';
import {Toast} from '@/utils/uniapi/prompt';
import {liveCourseListApi} from '@/services/list';

interface UserState {
    liveCourseList: Array<any>;
}

export const useLiveCourseStore = defineStore({
    id: 'liveCourse',
    state: (): UserState => ({
        liveCourseList:[],
    }),
    actions: {
        async queryLiveCourse(): Promise<any> {
            try {
                const { data=[], message= '请稍后再试', code } = await liveCourseListApi();
                if(code === 0){
                    if(data.length>0){
                        this.liveCourseList=data.filter( (course: any) => course.zbStatus==='1');
                    }
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
    },
});
