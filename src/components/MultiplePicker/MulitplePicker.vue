<template>
    <view class="content">
        <view class="picker-item" @click="handleClick">
            <view class="label">{{ label }}</view>
            <view class="result text-ellipsis-1">{{ resultLabel||'请选择' }}</view>
        </view>
        <uni-drawer ref="drawerRef" mode="right" :width="280">
            <view class="drawer-content">
                <uni-section title-font-size="34rpx" type="line" :title="label" />
                <uni-data-checkbox v-model="checkArray" multiple :localdata="pickerData"></uni-data-checkbox>
            </view>
            <view class="actions">
                <button size="mini" style="margin-right: 40rpx;" @click="drawerRef.close()">取消</button>
                <button size="mini" type="primary" @click="handleConfirm">确定</button>
            </view>
        </uni-drawer>
    </view>
</template>

<script setup name="MulitplePicker" lang="ts">
const props =defineProps({
    label: {
        type: String,
        default: '-'
    },
    pickerData: {
        type: Array,
        default:()=>[]
    },
    result:{
        type: String,
        default: ''
    }
});
const emits = defineEmits(['select']);
const drawerRef = ref();
const  result = ref(props.result);
const checkArray = ref(props.result.split(','));
const resultLabel = ref('');
const setResultLabel = ()=>{
    const filter = props.pickerData?.filter(item=>checkArray.value.includes(item.value));
    const res = filter.map(item=>item.text).join(',');
    resultLabel.value= res;
};
const handleClick = ()=>{
    checkArray.value=props.result.split(',');
    drawerRef.value.open();
};

const handleConfirm=()=>{
    const res = checkArray.value.join(',');
    result.value=res;
    console.log(res);
    setResultLabel();
    emits('select',res);
    drawerRef.value.close();
};
</script>

<style lang="scss" scoped>
.content {
  .picker-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    .label {
      margin-right: 30rpx;
    }
    .result {
      color: $uni-color-subtitle;
      flex: 1;
      text-align: right;
    }
  }
}
.drawer-content {
  position: relative;
  padding: $uni-container-padding;
  .title {
    font-size: $uni-font-size-lg;
    margin-bottom: 40rpx;
  }
}
.actions {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>