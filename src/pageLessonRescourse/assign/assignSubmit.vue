<!--
 * @Author: Lowkey
 * @Date: 2024-03-06 10:54:49
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-13 12:07:10
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\assign\assignSubmit.vue
 * @Description: 
-->

<template>
    <app-provider>
        <nav-bar title="提交作业" :show-modal="true" />
        <view v-if="textConfigs.enabled">
            <uni-section title="在线文本提交" type="line" style="background-color: transparent">
                <template v-if="wordlimitenabled !== '0'" #right>
                    {{ `最大长度${wordlimit}` }}
                </template>
                <bad-eidtor v-model="content" :limit="wordlimit" />
            </uni-section>
        </view>
        <view v-if="fileConfigs.enabled && maxfilesubmissions && maxsubmissionsizebytes">
            <uni-section title="文件提交" type="line" style="background-color: transparent">
                <file-picker
                    ref="fileRef"
                    :upload-file-list="uploadFileList"
                    :max-size="Number(maxsubmissionsizebytes)"
                    :max-files="Number(maxfilesubmissions)"
                    :allow-types="filetypeslist"
                />
            </uni-section>
        </view>
        <view class="btn">
            <button :loading="useAssign.saveLoading" type="primary" @click="onConfirmSave">保存更改</button>
        </view>
    </app-provider>
</template>
<script lang="ts" setup>
import useUploadFiles from '@/hooks/useUploadFiles';
import { useAssignStore } from '@/store/modules/assign';
import { getCurPageParam } from '@/utils';
import { Modal } from '@/utils/uniapi/prompt';

const useAssign = useAssignStore();
const router = useRouter();
// eslint-disable-next-line no-empty-pattern
const { submitDataType = [] } = useAssign.assignData;
const { fileConfigs, textConfigs } = useAssign.getConfigs;
const { maxsubmissionsizebytes, maxfilesubmissions, filetypeslist } = fileConfigs;
const { wordlimit, wordlimitenabled = '0' } = textConfigs; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!官方此参数并没有作用先不做判断了，仅展示！！！！！！！！！！

const getText = (arr: any[]) => {
    if (arr.find((item) => item.type === 'onlinetext')) {
        const res = arr.find((item) => item.type === 'onlinetext').editorfields[0].text;
        // const result = res.replace(/<br \/>/g, '\n');
        // return result.replace(/<(?!\/?br\/?.+?>)[^<>]*>/gi, '');
        return res;
    }
    return '';
};

/**
 * @description: 格式化网络文件对象（回显）
 * @param {*} arr
 * @return {*}
 */
const getFileList = (arr: any[]) => {
    const res: any[] = [];
    if (arr.find((item) => item.type === 'file')) {
        arr.find((item) => item.type === 'file').files.map((item, i) =>
            res.push({
                name: item.filename,
                path: `${item.fileurl}`,
                type: item.mimetype,
                file: { lastModified: item.timemodified * 1000 },
                size: item.filesize,
                uuid: `-${i++}`, //uuid 为字符串代表已上传文件
            })
        );
        return res;
    }
    return [];
};
const content = ref(getText(submitDataType));
const uploadFileList = ref(getFileList(submitDataType));
const fileRef = ref();

/**
 * @description: 文件上传完成后提交作业
 * @param {*} response
 * @return {*}
 */
const doSubmitAfterUpload = (response: any[]) => {
    const pageParams = getCurPageParam();
    const { instance } = pageParams;
    if (response.length) {
        const { itemid } = response[0];
        const params = {
            onlinetext: content.value,
            assignmentid: instance,
            filemanager: itemid,
        };
        useAssign.saveAssign(params, () => {
            router.back();
        });
    }
};
const { doUpload } = useUploadFiles({ successCallback: doSubmitAfterUpload });

const onSave = (): void => {
    const uploadFiles = fileRef.value?.uploadFiles;

    if (uploadFiles?.length) {
        doUpload(uploadFiles);
    } else {
        // 没有文件直接提交不需要filemanager参数
        const isRemoveAllFile: boolean = uploadFileList.value.length > 0;
        const RemoveParams = isRemoveAllFile ? { itemid: 0, filemanager: 1 } : {}; // 是否删除了所有文件
        const pageParams = getCurPageParam();
        const { instance } = pageParams;
        const params = {
            onlinetext: content.value,
            assignmentid: instance,
            ...RemoveParams,
        };

        useAssign.saveAssign(params, () => {
            router.back();
        });
    }
};
const onConfirmSave = () => {
    // prettifyModal({
    //     title:'保存更改',
    //     content:'确定保存本次更改？',
    //     onConfirm:onSave
    // });
    Modal({
        title: '保存更改',
        content: '确定保存本次更改？',
        confirmText: '确定',
        complete: function (res) {
            if (res.confirm) {
                onSave();
            }
        },
    });
};
</script>
<style lang="scss" scoped>
.btn {
    padding: 0 50rpx;
}
</style>
