<!--
 * @Author: Lowkey
 * @Date: 2024-03-08 11:26:21
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-14 15:30:54
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\assign\components\SubmitedContent.vue
 * @Description: 
-->

<template>
    <view class="content">
        <view v-for="(item,index) in data" :key="index">
            <view v-if="item.type==='onlinetext'&&item.editorfields[0].text.length">
                <uni-section :title="item.name" type="square">
                    <expand-content max-height="100rpx">
                        <!-- <rich-text :nodes="item.editorfields[0].text" space /> -->
                        <render-html :html="item.editorfields[0].text" space /> 
                    </expand-content>
                </uni-section>
            </view>
            <view v-else-if="item.type==='file'&&item.files.length">
                <uni-section :title="item.name" type="square">
                    <files-content :show-title="false" :file-list="item.files" @handle-download="handleDownload" />
                </uni-section>
            </view>
        </view>
    </view>
</template>

<script setup name="SubmitedContent" lang="ts">
import useLessonResource from '@/hooks/useLessonResource';
const { handlerTagAHrefParseParam } = useLessonResource();
const router = useRouter();
defineProps({
    data: {
        type: Array<any>,
        default: ()=>[]
    }
});

const handleDownload = (file:Record<string,any>):void=>{
    const {fileurl,filesize} = file;
    const fileParams = {
        fileurl,
        filesize,
        modname:'resource'
    };
    handlerTagAHrefParseParam(fileParams);
};

</script>

<style lang="scss" scoped>

</style>