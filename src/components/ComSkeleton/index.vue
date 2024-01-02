<template>
    <view class="x-skeleton" :style="variableStr">
        <!-- 骨架屏 -->
        <view
            v-if="skeletonLoading"
            class="x-skeleton__wrapper"
            :class="[ startFadeOut && 'fade-out' ]"
            :style="{ padding: skeletonConfigs.padding }"
        >
            <view
                v-for="(row, rowIndex) in gridRowsArr" :key="rowIndex"
                class="x-skeleton__wrapper__rows"
                :style="{ marginBottom: rowIndex < gridRowsArr.length - 1 ? skeletonConfigs.gridRowsGap : 0 }"
            >
                <view
                    v-for="(column, columnIndex) in gridColumnsArr" :key="columnIndex"
                    class="x-skeleton__wrapper__columns"
                    :style="{
                        flexDirection: skeletonConfigs.itemDirection,
                        alignItems: skeletonConfigs.itemAlign,
                        marginRight: columnIndex < gridColumnsArr.length - 1 ? skeletonConfigs.gridColumnsGap : 0,
                    }"
                >
                    <view
                        v-if="skeletonConfigs.headShow"
                        class="x-skeleton__wrapper__head"
                        :class="[ animate && 'animate' ]"
                        :style="{
                            width: skeletonConfigs.headWidth,
                            height: skeletonConfigs.headHeight,
                            borderRadius: skeletonConfigs.headBorderRadius,
                            marginRight: (skeletonConfigs.itemDirection == 'row' && skeletonConfigs.textShow) ? skeletonConfigs.itemGap : 0,
                            marginBottom: (skeletonConfigs.itemDirection == 'column' && skeletonConfigs.textShow) ? skeletonConfigs.itemGap : 0
                        }"
                    ></view>
                    <view v-if="skeletonConfigs.textShow" class="x-skeleton__wrapper__text">
                        <view
                            v-for="(text, textIndex) in textRowsArr" :key="textIndex"
                            class="x-skeleton__wrapper__text__row"
                            :class="[animate && 'animate']"
                            :style="{
                                width: text.width,
                                height: text.height,
                                borderRadius: skeletonConfigs.textBorderRadius,
                                marginBottom: textIndex < textRowsArr.length - 1 ? skeletonConfigs.textRowsGap : 0
                            }"
                        ></view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 插槽 -->
        <view v-else>
            <slot></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import {bannerConfigs, infoConfigs, listConfigs, menuConfigs, textConfigs, waterfallConfigs} from '@/enums/skeleton';

const props = defineProps({
    // 骨架屏类型
    type: {
        type: String,
        default: '' //banner轮播图、info个人信息、text段落、menu菜单、list列表、waterfall瀑布流
    },
    // 是否展示骨架组件
    loading: {
        type: Boolean,
        default: true
    },
    // 是否开启动画效果
    animate: {
        type: Boolean,
        default: true
    },
    // 动画效果持续时间，单位秒
    animateTime: {
        type: [Number, String],
        default: 1.8
    },
    // 是否开启淡出动画
    fadeOut: {
        type: Boolean,
        default: true
    },
    // 淡出效果持续时间，单位秒
    fadeOutTime: {
        type: [Number, String],
        default: 0.5
    },
    // 骨架的背景色
    bgColor: {
        type: String,
        default: '#EAEDF5'
    },
    // 骨架的动画高亮背景色
    highlightBgColor: {
        type: String,
        default: '#F9FAFF'
    },
    // 自定义配置
    configs: {
        type: Object,
        default: () => {
            return {
                padding: '30rpx',		   				  //内边距
                gridRows: 3, 			 	   			  //行数
                gridColumns: 2,	  		  	   			  //列数
                gridRowsGap: '40rpx',		   			  //行间隔
                gridColumnsGap: '24rpx',	   			  	  //竖间距
                itemDirection: 'column',   				  //head与text之间的排列方向（row、column）
                itemGap: '16rpx', 				  		  //head与text之间的间隔
                itemAlign: 'center',  	   				  //head与text之间的纵轴对齐方式（center、flex-start、flex-end、baseline）
                headShow: true,		 	   				  //head是否展示
                headWidth: '100%',	  	   				  //head宽度，支持百分比
                headHeight: '400rpx',	   				  //head高度
                headBorderRadius: '12rpx', 				  //head圆角，支持百分比
                textShow: true,		   				      //文本是否展示
                textRows: 3,		 	   				  	  //文本的行数
                textRowsGap: '12rpx',		   			  //文本间距
                textWidth: ['40%', '85%', '60%'], 		  //文本的宽度，可以为百分比，数值，带单位字符串等，可通过数组传入指定每个段落行的宽度
                textHeight: ['30rpx', '20rpx', '20rpx'],   //文本的高度，可以为数值，带单位字符串等，可通过数组传入指定每个段落行的高度
                textBorderRadius: '6rpx',  			      //文本的圆角，支持百分比
            };
        }
    }
});


const skeletonConfigs = ref(props.configs || {});
const skeletonLoading = ref(props.loading);
const startFadeOut = ref(false);

const isArray = (value) => {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === '[object Array]';
};

const addUnit = (value = 'auto', unit = 'px') => {
    value = String(value);
    return /^[\\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value) ? `${value}${unit}` : value;
};
const gridRowsArr = computed(() => new Array(Number(skeletonConfigs.value.gridRows || [])));
const gridColumnsArr = computed(() => new Array(Number(skeletonConfigs.value.gridColumns || [])));

const textRowsArr = computed(() => {
    if (!skeletonConfigs.value.textShow) return [];
    if (/%$/.test(skeletonConfigs.value.textHeight)) {
        console.error('x-skeleton: textHeight parameter does not support percentage units');
    }

    const rows = [];
    for (let i = 0; i < skeletonConfigs.value.textRows; i++) {
        const { gridRows, textWidth, textHeight } = skeletonConfigs.value;
        let curItem = {
            width:'',
            height:''
        };
        let rowWidth = isArray(textWidth) ? (textWidth[i] || (i === gridRows - 1 ? '70%' : '100%')) : i === gridRows - 1 ? '70%' : textWidth;
        let rowHeight = isArray(textHeight) ? (textHeight[i] || '30rpx') : textHeight;

        if (/%$/.test(rowWidth)) {
            curItem.width = rowWidth;
        } else {
            curItem.width = addUnit(rowWidth);
        }
        curItem.height = addUnit(rowHeight);
        rows.push(curItem);
    }
    return rows;
});

const variableStr = computed(() => {
    let keys = ['animateTime', 'fadeOutTime', 'bgColor', 'highlightBgColor'];
    return keys
        .map((item) => {
            if (item.indexOf('Time') > -1) {
                return `--${item}:${props[item]}s`;
            } else {
                return `--${item}:${props[item]}`;
            }
        })
        .join(';');
});

watch(
    () => props.loading,
    (value) => {
        if (value) {
            skeletonLoading.value = true;
        } else {
            if (props.fadeOut) {
                startFadeOut.value = true;
                setTimeout(() => {
                    skeletonLoading.value = false;
                    startFadeOut.value = false;
                }, props.fadeOutTime * 1000);
            } else {
                skeletonLoading.value = false;
            }
        }
    },
    { immediate: true }
);

watch(
    () => props.type,
    (value) => {
        if (value === 'banner') {
            skeletonConfigs.value = bannerConfigs;
        } else if (value === 'info') {
            skeletonConfigs.value = infoConfigs;
        } else if (value === 'text') {
            skeletonConfigs.value = textConfigs;
        } else if (value === 'menu') {
            skeletonConfigs.value = menuConfigs;
        } else if (value === 'list') {
            skeletonConfigs.value = listConfigs;
        } else if (value === 'waterfall') {
            skeletonConfigs.value = waterfallConfigs;
        } else {
            skeletonConfigs.value = props.configs || {};
        }
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
@mixin background {
    background: linear-gradient(90deg, var(--bgColor) 25%, var(--highlightBgColor) 37%, var(--bgColor) 50%);
    background-size: 400% 100%;
}

.x-skeleton {
    width: 100%;
    box-sizing: border-box;

    .x-skeleton__wrapper {
        display: flex;
        flex-direction: column;

        &__rows {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__columns {
            display: flex;
            align-items: center;
            flex: 1;
        }

        &__head {
            width: 100%;
            @include background;
        }

        &__text {
            flex: 1;
            width: 100%;
            &__row {
                @include background;
            }
        }
    }

    .fade-out {
        opacity: 0;
        animation: fadeOutAnim var(--fadeOutTime);
    }

    @keyframes fadeOutAnim {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .animate {
        animation: skeletonAnim var(--animateTime) ease infinite;
    }

    @keyframes skeletonAnim {
        0% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0 50%;
        }
    }
}
</style>
