<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-08 17:05:34
 * @FilePath: \BK-Portal-VUE\src\components\NavBar\NavBar.vue
 * @Description: 
-->
<template>
    <uni-nav-bar :dark="dark" color="#fff" background-color="#4b99ec" :border="false" :shadow="shadow" :title="title" left-icon="left" :right-text="rightText" @click-left="handleLeftClick" @click-right="handleRightClick">
        <template #left>
            <slot name="left"></slot>
        </template>
        <template #right>
            <slot name="right"></slot>
        </template>
    </uni-nav-bar>
</template>

<script setup name="Nav">
const router = useRouter();
defineProps({
    dark: {
        type: Boolean,
        default: false
    },
    shadow: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '(●◡●)'
    },
    rightText:{
        type: String,
        default: ''
    }
});
const emit = defineEmits(['handle-right-click']);
const handleLeftClick = ()=>{
    router.back();
};
const handleRightClick = ()=>{
    emit('handle-right-click');
};

</script>

