
import {defineStore} from 'pinia';
import {Toast} from '@/utils/uniapi/prompt';
import {attendanceCourseListApi} from '@/services/list';
import {useUserStore} from '@/store/modules/user';

interface UserState {
    attendanceCourseList: Array<any>;
    attendanceData:Record<string,any>;
}

export const useAttendanceCourseStore = defineStore({
    id: 'attendanceCourse',
    state: (): UserState => ({
        attendanceCourseList:[],
        attendanceData:{},
    }),
    actions: {
        async queryAttendanceCourseList(): Promise<any> {
            const useUser = useUserStore();
            const attendanceParams:AttendanceCourseParams = {
                userid:useUser.moodleUserId,
            };
            try {
                const { data=[], message= '请稍后再试', success } = await attendanceCourseListApi(attendanceParams);
                if(success){
                    if(data.length>0){
                        this.attendanceCourseList=data;
                    }
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        }
    },
});
