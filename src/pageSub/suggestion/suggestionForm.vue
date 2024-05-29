<!-- eslint-disable no-useless-catch -->
<!--
 * @Author: Lowkey
 * @Date: 2024-05-17 12:23:29
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-23 18:12:15
 * @FilePath: \BK-Portal-VUE\src\pageSub\suggestion\suggestionForm.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar title="反馈" />
        <view class="content">
            <view v-if="baseFormData.submitType === 'platform'" class="tips">使用过程中发现的问题，通过提交反馈我们收到后将第一时间进行调整。</view>
            <uni-section v-else title="课程信息" type="line">
                <view class="suggestion-info">
                    <view class="lesson-name">{{ useLesson.lessonData?.fullname }}</view>
                    <view v-if="baseFormData.submitType == 'lessonContent'" class="teacher-name">{{ `责任教师：${masters.name}` }}</view>
                    <view v-else class="teacher-name">{{ `辅导教师：${tutors.name}` }}</view>
                    <view v-if="resourceName" class="resource-name">{{ resourceName }}</view>
                </view>
            </uni-section>
            <view class="form">
                <uni-forms ref="baseForm" :rules="rules" :model-value="baseFormData" label-position="top">
                    <uni-forms-item v-if="baseFormData.submitType !== 'platform' && !resourceName" label="资源名称">
                        <uni-data-picker v-model="baseFormData.cmid" placeholder="请选择" popup-title="请选择类型" :localdata="resourceDataTree">
                        </uni-data-picker>
                    </uni-forms-item>
                    <uni-forms-item v-if="baseFormData.submitType !== 'platform' && resourceName" label="反馈类型" required>
                        <uni-data-picker v-model="baseFormData.submitType" placeholder="请选择" popup-title="请选择类型" :localdata="suggestionTypeDataTree">
                        </uni-data-picker>
                    </uni-forms-item>
                    <uni-forms-item label="反馈内容" name="submitContent" required>
                        <uni-easyinput v-model="baseFormData.submitContent" :maxlength="200" type="textarea" auto-height placeholder="请输入反馈内容" />
                    </uni-forms-item>
                </uni-forms>
                <uni-section title="上传图片" type="line">
                    <view>
                        <uni-file-picker ref="imgPickerRef" limit="3" :auto-upload="false" title="最多选择3张图片"></uni-file-picker>
                    </view>
                </uni-section>
            </view>
            <button :loading="submitting" type="primary" @click="submitSuggestion">提交</button>
        </view>
    </app-provider>
</template>
<script lang="ts" setup>
import useUploadFiles from '@/hooks/useUploadFiles';
import { useUserStore } from '@/store/modules/user';
import { useLessonStore } from '@/store/modules/lesson';
import { useSystem } from '@/hooks/app/useSystem';
import { suggestionAddApi } from '@/services/suggestion';
import { getCurPageParam } from '@/utils';
import { gradeDetailsApi } from '@/services/list';
import { Toast } from '@/utils/uniapi/prompt';
const pageParams = getCurPageParam();
const { courseid, modname, instance, cmid, suggestionType = 'platform', resourceName } = pageParams;
const deviceBrand = useSystem().deviceBrand;
const useUser = useUserStore();
const router = useRouter();
const useLesson = useLessonStore();
const masters = computed(() => {
    const masterArr = useLesson.lessonData.master || [];
    return {
        name: masterArr.map((item) => item.fullname).join(',') || '无责任教师',
    };
});
const tutors = computed(() => {
    const tutorArr = useLesson.lessonData.tutor || [];
    return {
        name: tutorArr.map((item) => item.fullname).join(',') || '无辅导教师',
    };
});
const submitting = ref(false);
const imgPickerRef = ref();
const userInfo: Record<string, any> = ref({});
const baseFormData = reactive({
    submitContent: '',
    submitUserPhone: '',
    submitType: 'platform',
    cmid: '',
});
const rules = {
    submitContent: {
        rules: [
            {
                required: true,
                errorMessage: '请输入反馈内容',
            },
        ],
    },
};
watch(
    () => baseFormData.submitType,
    (val) => {
        baseFormData.submitType = val;
    }
);

const typeMap: Record<string, any> = {
    platform: '平台功能',
    lessonContent: '课程内容',
    grade: '学习成绩',
};

const resourceData = ref<Record<string, any>>([]);

const resourceDataTree = computed(() => {
    return resourceData.value.map((item: Record<string, any>) => ({ text: item.title, value: item.id }));
});

const suggestionTypeDataTree = [
    {
        text: '课程内容',
        value: 'lessonContent',
    },
    {
        text: '学习成绩',
        value: 'grade',
    },
];
const baseForm = ref();

const { doUploadSuggestionFiles } = useUploadFiles();
const submitSuggestion = () => {
    let submitAnnex: string[] = [];
    baseForm.value.validate().then(async () => {
        submitting.value = true;
        const imageList = imgPickerRef.value.files;
        if (imageList.length) {
            submitAnnex = await doUploadSuggestionFiles(imageList);
        }
        const params = {
            ...baseFormData,
            submitUserPhone: userInfo.value.phone,
            submitUserEmail: userInfo.value.email,
            submitType: typeMap[baseFormData.submitType],
            submitDeviceInfo: deviceBrand,
            userid: userInfo.value.eduUserId,
            submitUserName: userInfo.value.userName,
            submitAnnex: submitAnnex.join(','),
            submitStudentNumber: userInfo.value.studentNumber,
        };
        try {
            const { success, msg = '提交失败，请稍后再试' } = await suggestionAddApi(params);
            if (success) {
                router.back();
                Toast('提交成功');
            } else {
                Toast(msg);
            }
            // eslint-disable-next-line no-useless-catch
        } catch (error) {
            throw error;
        } finally {
            submitting.value = false;
        }
    });
};

const queryResourceList = async () => {
    try {
        const { data, success } = await gradeDetailsApi({ userid: useUser.moodleUserId, courseid });
        if (success) {
            resourceData.value = data;
        }
    } catch (error) {}
};
onLoad(async () => {
    baseFormData.submitType = suggestionType;
    if (courseid) {
        await useLesson.queryCourseContent({ courseid });
    }
    if (suggestionType === 'lessonContent') {
        // 课程反馈
        if (!modname) {
            // 请求资源列表
            queryResourceList();
        }
    } else if (suggestionType === 'grade') {
        // 分数反馈
        if (!resourceName) {
            // 请求资源列表
            queryResourceList();
        }
    }

    await useUser.queryInfo();
    userInfo.value = useUser.curUserInfo;
});
</script>
<style lang="scss" scoped>
.suggestion-info {
    .lesson-name {
        font-size: $uni-font-size-lg;
        margin-bottom: 20rpx;
    }
    .resource-name {
        font-size: $uni-font-size-m;
        color: $uni-color-subtitle;
        margin-bottom: 20rpx;
    }
    .teacher-name {
        font-size: $uni-font-size-m;
        color: $uni-color-subtitle;
        margin-bottom: 20rpx;
        text-align: right;
    }
}
.content {
    padding: $uni-container-padding;
    .form {
        margin-bottom: 60rpx;
    }
}
.tips {
    font-size: $uni-font-size-lg;
    color: $uni-color-primary;
    margin-bottom: 40rpx;
}
</style>
