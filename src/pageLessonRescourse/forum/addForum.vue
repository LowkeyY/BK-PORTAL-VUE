<template>
    <app-provider>
        <nav-bar :title="params.type === 'add' ? '开启一个新话题' : '回复'" />
        <view class="content">
            <uni-forms ref="baseForm" :model-value="formData">
                <uni-forms-item label="主题" class="form-item">
                    <uni-easyinput v-model="formData.subject" placeholder="请输入主题" :input-border="false" />
                </uni-forms-item>
                <uni-forms-item class="form-item">
                    <bad-eidtor v-model="formData.message" />
                </uni-forms-item>
                <view v-if="params.type === 'add' && isArray(getGroups(groups, params.course)) && getGroups(groups, params.course).length > 0">
                    {{ getGroups(groups, params.course)[0].label }}
                </view>
                <view v-if="!parseInt(params.maxattachments, 10) < 1">
                    <file-picker
                        ref="fileRef"
                        :upload-file-list="fileList"
                        :max-size="Number(params.maxbytes)"
                        :max-files="Number(params.maxattachments)"
                        @upload-end-callback="doSubmitAfterUpload"
                    />
                </view>
                <view style="padding: 20rpx 50rpx;">
                    <button type="primary" :loading="useForum.submitLoading" style="backgroundcolor: #2b83d7; bordercolor: #2b83d7;" @click="handelSubmit()">
                        提交
                    </button>
                </view>
            </uni-forms>
        </view>
    </app-provider>
</template>

<script setup lang="ts">
import { Modal, Toast } from '@/utils/uniapi/prompt';
import { useAppStore } from '@/store/app';
import { isArray } from '@/utils/is';
import { renderSize } from '../../utils';
import useUploadFiles from '@/hooks/useUploadFiles';
import { useForumStore } from '@/store/modules/forum';

const router = useRouter();
const params = ref({});
const submitParams = ref({});
const fileList = ref([]);
const fileRef = ref();
const formData = reactive({
    subject: '',
    message: '',
});
const useApp = useAppStore();
const useForum = useForumStore();
const groups = computed(() => useApp.groups);


/**
 * @description: 文件上传完成后提交回复话题
 * @param {*} response
 * @return {*}
 */
const doSubmitAfterUpload = (val) => {
    if(val){
        const subParams = {
            ...submitParams.value,
            itemid:val,
        };
        params.value.type === 'add'
            ? useForum.addForum(subParams, () => {
                router.back();
            })
            : useForum.addPost(subParams, () => {
                router.back();
            });
    }else{
        Toast( '上传附件时，发声未知错误，请稍候重试。');
    }
};
const { doUpload ,successData} = useUploadFiles({ successCallback: doSubmitAfterUpload });

const getGroups = (groups, id) => {
    const arr = [];
    isArray(groups) &&
        groups
            .filter((item) => item.courseid === id)
            .map((data) => {
                arr.push({
                    label: data.name || '',
                    value: parseInt(data.id, 10),
                });
            });
    return arr;
};


const confirmSubmit =async () => {
    if (params.value.type === 'add') {
        submitParams.value = {
            courseid: params.value.course ? params.value.course : '',
            forumid: params.value.id,
            discussion: params.value.discussionid ? params.value.discussionid : '',
            groupid: params.value.course,
            ...formData,
        };
    } else {
        submitParams.value = {
            ...formData,
            postid: params.value.id,
            discussion: params.value.discussionid ?  params.value.discussionid : '',
        };
    }
    if (fileRef.value?.uploadFiles.length > 0&&fileRef.value?.hasFilesChange) {
        fileRef.value?.handleUpload();
    } else {
        params.value.type === 'add'
            ? useForum.addForum(submitParams.value, () => {
                router.back();
            })
            : useForum.addPost(submitParams.value, () => {
                router.back();
            });
    }
};
const handelSubmit = async () => {
    if (!formData.subject) {
        Toast('请输入主题', { icon: 'error' });
        return;
    }
    if (!formData.message) {
        Toast('请输入主题内容', { icon: 'error' });
        return;
    }

    Modal({
        title: params.value.type === 'add'?'保存':'保存更改',
        content: '确定保存？',
        confirmText: '确定',
        complete: function (res) {
            if (res.confirm) {
                confirmSubmit();
            }
        },
    });
};

onLoad(async (options) => {
    if (options) {
        params.value = options;
        if (options.subject) {
            formData.subject = options.subject;
        }
    }
});
</script>

<style scoped lang="scss">
.content {
  padding: 20rpx;
}
.form-item {
  border-bottom: 2rpx solid #e0e0e0;
}
::v-deep .uni-easyinput__content-textarea {
  line-height: 1.5;
  font-size: 28rpx;
  height: 500rpx;

  /* #ifndef APP-NVUE */
  min-height: 500rpx;
  width: auto;

  /* #endif */
}
.warn-tip {
  color: #ef2828;
  font-size: 30rpx;
  padding: 10rpx 0;
}
</style>
