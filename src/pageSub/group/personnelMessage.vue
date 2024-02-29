<template>
    <view>
        <LoadingIcon :loading="loading"></LoadingIcon>
        <uni-icons class="back" type="left" size="30" color="#fff" @click="router.back"></uni-icons>
        <personInformation :user-info="curPerson" @handle-message="handleMessage" @add-contact="addContact" />
    </view>
</template>

<script setup lang="ts">
import {addContactsApi, personInfoApi} from '@/services/user';
import LoadingIcon from '@/components/LoadingIcon/index.vue';
import {Toast} from '@/utils/uniapi/prompt';

const router=useRouter();
const curPerson=ref({});
const loading=ref(false);

const handleMessage = () => {
    console.log(curPerson.value);
};
const addContact =async () => {
    const {id}=curPerson.value;
    const {success}= await addContactsApi({touserid:id});
    if(success){
        Toast('成功添加联系人', { icon: 'success' });
    }
};

onLoad(async option=>{
    const {id}=option;
    loading.value=true;
    const res= await personInfoApi({userid:id});
    if(res.success){
        curPerson.value=res;
    }
    loading.value=false;
});
</script>

<style scoped>
.back {
  position: absolute;
  left: 30rpx;
  top: 30rpx;
    z-index: 2;
}

</style>
