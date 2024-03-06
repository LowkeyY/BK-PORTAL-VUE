
<template>
    <view>
        <pull-refresh-list type="content" :loading="loading" :has-more="false" :is-refresh="isRefresh" @on-refresh="refresh">
            <view v-if="curLesson.attendanceType==='1'">
                <view class="refresh">
                    <text>
                        数据更新时间：
                        <text :style="{'color': `${getAttendanceTime(parseInt(attendanceData.update_timer, 10)).color}` || ''}">
                            {{ getAttendanceTime(parseInt(attendanceData.update_timer, 10)).time || '未知' }}
                        </text>
                    </text>
                    <text class="refresh-btn" @click="handleAttendanceRefresh">
                        更新考勤状态
                        <uni-icons type="refresh" size="14" color="#2b83d7"></uni-icons>
                    </text>
                </view>
                <view class="attendance-main">
                    <view v-if="curLesson.fullname" class="attendance-title">
                        <text>{{ curLesson.fullname }}</text>
                    </view>
                    <view class="attendance-content">
                        <view class="left">
                            <view class="left-detail">开课时间:{{ `${changeLessonDate(curLesson.startdate)}-${changeLessonDate(curLesson.enddate)}` }}</view>
                            <view class="left-detail">{{ `周全勤天数要求:${attendanceData.day_pass}次/周` }}</view>
                            <view class="left-detail">实际教学周数:{{ attendanceData.weeks }}</view>
                        </view>
                        <view class="right">
                            <view class="right-content">
                                <image style="width: 200rpx; height: 200rpx;" mode="scaleToFill" src="/static/images/huise.png"></image>
                                <view class="pass">
                                    <view style="font-size: 60rpx;">{{ passedNum }}</view>
                                    <view>达标</view>
                                </view>
                            </view>
                            <view class="not-pass">
                                {{ `未达标周次${noPassedWeeks}` }}
                            </view>
                        </view>
                    </view>
                </view>
                <view class="attendance-disan" />
                <view v-if="attendanceData.current_week && JSON.stringify(attendanceData.current_week) !== '{}'" class="cur-week">
                    <view class="week-row">
                        <view class="week-index">
                            <image style="width: 60rpx; height: 60rpx;" mode="scaleToFill" src="/static/svg/resourceIcon/attendance.svg"></image>
                            <text style="padding-left: 20rpx;">当前周</text>
                        </view>
                    </view>
                    <view class="week-day">
                        <view v-for="(week,index) in grid" :key="index">{{ ['一', '二', '三', '四', '五', '六', '日'][index] }}</view>
                    </view>
                    <view class="week-state">
                        <view v-for="(week,index) in curGrid" :key="index">{{ week[`day${index + 1}`] }}</view>
                    </view>
                    <view class="week-attendance">
                        <text>{{ `周出勤天数: ${getWeekAttendance(attendanceData.current_week)}` }}</text>
                        <uni-tag :text="attendanceData.weekStat?'达标' : '未达标'" :type="attendanceData.weekStat?'success' : 'error'" />
                    </view>
                </view>
                <view v-if="attendanceData.passed_weeks&&attendanceData.passed_weeks.length">
                    <view v-for="(week) in passedWeeks" :key="index" class="week-row" style="margin-top: 40rpx;">
                        <view class="week-index">
                            <image style="width: 60rpx; height: 60rpx;" mode="scaleToFill" src="/static/svg/resourceIcon/attendance.svg"></image>
                            <text style="padding-left: 20rpx;">{{ `第${week.slot}周` }}</text>
                        </view>
                        <uni-tag :text="week.stat?'达标' : '未达标'" :type="week.stat?'success' : 'error'" />
                    </view>
                </view>
            </view>
            <view v-if="curLesson.attendanceType==='2'">
                <view class="attendance-main">
                    <view v-if="curLesson.fullname" class="attendance-title">
                        <text>{{ curLesson.fullname }}</text>
                    </view>
                    <view class="attendance-content">
                        <view class="left">
                            <view class="left-detail">开课时间:{{ `${changeLessonDate(curLesson.startdate)}` }}</view>
                            <view class="left-detail">{{ `考勤类型:${attendanceData.attendanceInfo}` }}</view>
                            <view class="left-detail">实际教学周数:{{ attendanceData.weeks }}</view>
                            <view class="left-detail">课程总在线时长：{{ attendanceData.attendanceTimer }}</view>
                            <view class="left-detail">合格学习时长：{{ attendanceData.attendanceTimerMin }}</view>
                        </view>
                        <view class="right">
                            <view class="right-content">
                                <image style="width: 200rpx; height: 200rpx;" mode="scaleToFill" src="/static/images/huise.png"></image>
                                <view class="pass">
                                    <view style="font-size: 60rpx;">{{ attendanceData.total }}</view>
                                    <view>分钟</view>
                                </view>
                            </view>
                            <view class="not-pass">
                                {{ attendanceData.total >= attendanceData.attendanceTimerMin ? '已合格' : '与合格时长相差'+ (attendanceData.attendanceTimerMin - attendanceData.total)+'分钟' }}
                            </view>
                        </view>
                    </view>
                </view>
                <view class="duration-list">
                    <!-- 表头 -->
                    <view class=" header-row">
                        <view class="table-cell header-cell">周次</view>
                        <view class="table-cell header-cell">时段</view>
                        <view class="table-cell header-cell">周时长(分钟)</view>
                    </view>

                    <!-- 数据行 -->
                    <view v-if="attendanceData.data&&attendanceData.data.length">
                        <view v-for="(item, index) in attendanceData.data" :key="index" class="table-row">
                            <view class="table-cell">{{ item.week }}</view>
                            <view class="table-cell">{{ `${item.start}-${item.end}` }}</view>
                            <view class="table-cell">{{ item.duration }} 分钟</view>
                        </view>
                    </view>
                </view>
                <view class="end">
                    <text>{{ attendanceData.info }}</text>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import {useLessonStore} from '@/store/modules/lesson';
import {changeLessonDate, getAttendanceTime} from '@/utils';

const useLesson=useLessonStore();
const attendanceData:Record<string, any> = computed(()=>useLesson.attendanceData);
const lessonData = computed(()=>useLesson.lessonData);
let curLesson=ref({
    courseid:'',
    attendanceType:'',
    enddate:'',
    fullname:'',
    startdate:''
});
const noPassedWeeks = computed(()=>useLesson.attendanceData.passed_weeks?.filter(item => item.stat === 0).length);
const passedWeeks = computed(()=>useLesson.attendanceData.passed_weeks);
const passedNum = computed(()=>{
    let num = 0;
    if(useLesson.attendanceData?.passed_weeks?.length){
        useLesson.attendanceData.passed_weeks.map((item, i) => {
            if (item.stat === 1) {
                num += 1;
            }
        });
        if (useLesson.attendanceData.weekStat) {
            num += 1;
        }
        return num;
    }
});
const curCourseid=ref('');
const grid = [
    { day1: 0 },
    { day2: 0 },
    { day3: 0 },
    { day4: 0 },
    { day5: 0 },
    { day6: 0 },
    { day7: 0 }
];
const curGrid=ref([]);


// 刷新
const loading=ref(false);
const isRefresh=ref(false);
const refresh =async (callback: () => void) => {
    isRefresh.value=true;
    try {
        const {attendanceType}=curLesson.value;
        attendanceType==='2'?await useLesson.queryDurationCourse({courseid:curCourseid.value}): await useLesson.queryAttendanceRefresh({courseid:curCourseid.value});
        curGrid.value=getGrid(Object.assign(...grid, attendanceData.value.current_week));
    } finally {
        callback();
        isRefresh.value=false;
    }
};


const getGrid = (obj) => {
    const arr = [];
    Object.keys(obj)
        .map((items, i) => {
            let o = {};
            o[items] = obj[items];
            arr.push(o);
        });
    return arr;
};

const getWeekAttendance = (obj) => {
    let num = 0;
    Object.keys(obj)
        .map((items) => {
            if (parseInt(obj[items], 10) === 1) {
                num += 1;
            }
        });
    return num;
};
const handleAttendanceRefresh =async () => {
    await useLesson.queryAttendanceRefresh({courseid:curCourseid.value});
};

onLoad(async (option)=>{
    console.log('--------------------------------------');
    loading.value=true;
    const {courseid,attendanceType,enddate,fullname,startdate}=option;
    curLesson.value={
        courseid,
        attendanceType:attendanceType||lessonData.value.attendanceType,
        enddate:enddate||lessonData.value.startdate,
        fullname,
        startdate:startdate||lessonData.value.startdate
    };
    curCourseid.value=courseid;
    curGrid.value=getGrid(Object.assign(...grid, attendanceData.value.current_week));
    attendanceType==='2'?await useLesson.queryDurationCourse({ courseid }): await useLesson.queryAttendanceCourse({ courseid });
    loading.value=false;
});
</script>
<style lang="scss" scoped>
.refresh {
  font-size: $uni-font-size-base;
  display: flex;
  justify-content: space-between;
  .refresh-btn {
    color: $uni-color-primary;
  }
}
.attendance-main {
  width: 100%;
  border-radius: 30rpx;
  background: linear-gradient(#3376b2, #2385c7);
  color: $uni-text-color-inverse;
  margin-top: 20rpx;
  padding: 20rpx 20rpx 20rpx 40rpx;
  font-size: $uni-font-size-m;
  .attendance-title {
    font-size: $uni-font-size-lg;
    padding-bottom: 30rpx;
    border-bottom: 2rpx solid #fff;
  }
  .attendance-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 260rpx;
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 260rpx;
  }
  .right-content {
    width: 200rpx;
    height: 200rpx;
    position: relative;
    color: $uni-color-primary;
    .pass {
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  .not-pass {
    padding: 20rpx 0 10rpx;
  }
}
.attendance-disan {
  width: 0;
  height: 0;
  border-top: 40rpx solid #2385c7;
  border-bottom: 10rpx solid transparent;
  border-right: 40rpx solid transparent;
  border-left: 40rpx solid transparent;
  position: relative;
  top: 0;
  left: 50%;
  transform: translate(-50%);
}
.week-row {
  background: #dae8f3;
  width: 100%;
  padding: 20rpx;
  border-radius: 20rpx;
  color: $uni-color-primary;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .week-index {
    display: flex;
    align-items: center;
  }
}
.week-day,
.week-state {
  padding: 20rpx 20rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $uni-color-primary;
}
.week-state {
  color: $uni-text-color;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #ededed;
}
.week-attendance {
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.duration-list {
  margin: 40rpx 0;
}
.table-row {
  display: flex;
  padding: 20rpx;
  margin-top: 20rpx;
  color: #2b83d7;
  background: #dae8f3;
}
.header-row {
  font-weight: bold;
  display: flex;
}
.table-cell {
  flex: 1;
  padding: 20rpx 10rpx;
  text-align: center;
  font-size: $uni-font-size-m;
}
.end {
  width: 100%;
  color: red;
  font-size: $uni-font-size-m;
  text-align: center;
}
</style>
