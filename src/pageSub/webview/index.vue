<!--
 * @Author: Lowkey
 * @Date: 2024-01-11 13:16:32
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-15 13:43:32
 * @FilePath: \BK-Portal-VUE\src\pageSub\webview\index.vue
 * @Description: 
-->


<template>
    <web-view
        :src="targetUrl" :webview-styles="{progress:{
            color:'#2b83d7'
        }}"
    ></web-view>
</template>
<script lang="ts" setup>
const targetUrl = ref('');
onLoad((option) => {
    if (option) {
        const {url} = option;
        targetUrl.value=decodeURIComponent(url);
    }
});

</script>
<style lang="scss" scoped></style>
