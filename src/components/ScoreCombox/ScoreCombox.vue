<template>
    <uni-combox v-model="curScore" :candidates="rateRange" :placeholder="placeholder" @input="handleScore"></uni-combox>
</template>

<script setup lang="ts">
defineProps({
    rateRange: {
        type: Array,
        default: () => [],
    },
    score: {
        type: [Number,String],
        default:'',
    },
    placeholder:{
        type:String,
        default:'请评分'
    }
});
const curScore=ref();

const handleScore = (e) => {
    console.log(e);
};
</script>

