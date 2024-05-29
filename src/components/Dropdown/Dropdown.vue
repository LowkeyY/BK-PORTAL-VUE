<template>
    <view :class="['dropdown', isCeiling && 'dropdown-ceiling']" :style="`--dropdownThemeColor:${themeColor};--dropdownThemeColorRgb:${hexToRgb(themeColor)}`">
        <!-- 导航 -->
        <view class="dropdown-menu">
            <view class="dropdown-menu-title">
                <view class="line"></view>
                {{ title }}
            </view>
            <view v-for="(item, index) in menuList" :key="index" class="dropdown-menu-item" @tap.stop="menuClick(index)">
                <view class="flex">
                    <text
                        class="dropdown-menu-item-text"
                        :style="{
                            color: index === current ? themeColor : inactiveColor,
                        }"
                    >
                        {{ item.title }}
                    </text>
                    <view
                        v-if="item.type === 'sort'"
                        :class="[
                            'dropdown-menu-item-arrow',
                            item.value === 'asc' && 'dropdown-menu-item-arrow_top',
                            item.value === 'desc' && 'dropdown-menu-item-arrow_bottom',
                        ]"
                    >
                    </view>
                    <view v-if="item.type !== 'sort'" :class="['dropdown-menu-item-basicarrow', index === current && 'dropdown-menu-item-basicarrow_rotate']">
                    </view>
                </view>
            </view>
        </view>
        <!-- 展示的内容 -->
        <view
            class="dropdown-content"
            :style="[
                {
                    transition: `opacity ${duration / 1000}s linear`,
                    top: 'auto',
                    bottom: `calc(100vh - ${contentHeight + windowTop}px)`,
                    height: `calc(100vh - ${contentHeight + windowTop}px)`,
                },
                contentStyle,
            ]"
            @tap="close"
        >
            <view ref="leDropdownContentPopupRef" class="dropdown-content-popup" :style="[popupStyle]" @tap.stop.prevent>
                <block v-for="(item, index) in menuList" :key="index">
                    <!-- 单选列表 -->
                    <view v-if="item.type === 'cell' && index === current" class="dropdown-popup-content dropdown-cell">
                        <view
                            v-for="(sItem, sIndex) in item.options"
                            :key="sIndex"
                            :class="['dropdown-cell-item', item.value === sItem.value && 'dropdown-cell-active']"
                            @click="onSelectCell(sItem, index)"
                        >
                            <view class="dropdown-cell-active-text">{{ sItem.label }}</view>
                            <view v-show="item.value === sItem.value" class="dropdown-cell-active-icon"></view>
                        </view>
                    </view>
                    <!-- 级联动选择 -->
                    <view v-if="item.type === 'picker' && index === current" class="dropdown-popup-content dropdown-picker">
                        <dropdown-item v-model="item.value" v-bind="item.componentProps"> </dropdown-item>
                        <view class="dropdown-footer">
                            <view class="dropdown-confirm" @click="onFilterConfirm(item, index)">
                                {{ item.confirmText || '确定' }}
                            </view>
                        </view>
                    </view>
                    <!-- 筛选 -->
                    <view v-if="item.type === 'filter' && index === current" class="dropdown-popup-content dropdown-filter">
                        <view v-for="(sItem, sIndex) in item.children" :key="sIndex" class="dropdown-filter-item">
                            <view class="dropdown-filter-title">
                                {{ sItem.title }}
                                <text v-if="sItem.type === 'slider'" class="dropdown-filter-subtitle"> {{ sItem.value }}{{ sItem.suffix }} </text>
                            </view>
                            <view class="dropdown-filter-content">
                                <!-- 单选类型 -->
                                <block v-if="sItem.type === 'radio'">
                                    <view
                                        v-for="(ssItem, ssIndex) in sItem.options"
                                        :key="ssIndex"
                                        :class="['dropdown-filter-box', sItem.value === ssItem.value && 'dropdown-filter-box-active']"
                                        @click="onRadioFilter(sIndex, ssItem, index)"
                                    >
                                        {{ ssItem.label }}
                                    </view>
                                </block>
                                <!-- 多选类型 -->
                                <block v-else-if="sItem.type === 'checkbox'">
                                    <view
                                        v-for="(ssItem, ssIndex) in sItem.options"
                                        :key="ssIndex"
                                        :class="['dropdown-filter-box', sItem.value.includes(ssItem.value) && 'dropdown-filter-box-active']"
                                        @click="onCheckboxFilter(sIndex, ssItem, index)"
                                    >
                                        {{ ssItem.label }}
                                    </view>
                                </block>
                                <!-- 滑块类型 -->
                                <block v-else-if="sItem.type === 'slider'">
                                    <slider
                                        style="width: 100%"
                                        :active-color="themeColor"
                                        :value="sItem.value"
                                        :min="sItem.componentProps.min || 0"
                                        :max="sItem.componentProps.max || 100"
                                        :step="sItem.componentProps.step || 1"
                                        :show-value="sItem.componentProps['show-value'] || true"
                                        @change="onSliderChange($event, sIndex, ssItem, index)"
                                    />
                                </block>
                            </view>
                        </view>
                        <view class="dropdown-footer">
                            <view class="dropdown-reset" @click="onFilterReset(item, index)">重置</view>
                            <view class="dropdown-confirm" @click="onFilterConfirm(item, index)">
                                {{ item.confirmText || '确定' }}
                            </view>
                        </view>
                    </view>
                </block>
            </view>
            <view class="dropdown-content-mask" @click="close"></view>
        </view>
    </view>
</template>

<script setup>
/**
 * menuList 导航数据
 * @property {String} title 导航名称
 * @property {String} type =[cell|picker|sort|click|filter] 导航点击展示的类型
 * 	@value cell 下拉选择（单选）
 * 	@value picker 级联动
 * 	@value sort 排序
 * 	@value click 点击
 * 	@value filter 复杂筛选
 * @property {String} value 导航当前选中的值
 * @property {Array} options 导航展示可选的数据值
 * */
import { ref, computed, getCurrentInstance, onMounted } from 'vue';
import DropdownItem from './DropdownItem.vue';

const props = defineProps({
    title: {
        type: String,
        default: '列表',
    },
    // 导航数据
    menuList: {
        type: Array,
        default: () => {
            return [];
        },
    },
    // 主题的颜色
    themeColor: {
        type: String,
        default: '#2b83d7',
    },
    // 没选中的颜色
    inactiveColor: {
        type: String,
        default: '#333333',
    },
    // 过渡时间
    duration: {
        type: [Number, String],
        default: 300,
    },
    // 是否吸顶
    isCeiling: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['open', 'close', 'update:menuList', 'onConfirm', 'onChange']);
// 初始化数据用于重置使用
const cloneDeep = (obj) => {
    let result = typeof obj.splice === 'function' ? [] : {};
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = cloneDeep(obj[key]); //如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
            } else {
                result[key] = obj[key]; //如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
            }
        }
        return result;
    }
    return obj;
};
const hexToRgb = (hexStr) => {
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = hexStr.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值f
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
        }
        let rgbText = sColorChange.join(',');
        return rgbText;
    } else {
        return sColor;
    }
};
const initMenuList = cloneDeep(props.menuList);
const instance = getCurrentInstance(); // 获取组件实例
// 下拉出来部分的样式
const popupStyle = computed(() => {
    let style = {};
    // 进行Y轴位移，展开状态时，恢复原位。收齐状态时，往上位移100%，进行隐藏
    style.transform = `translateY(${active.value ? 0 : '-100%'})`;
    style['transition-duration'] = props.duration / 1000 + 's';
    return style;
});
// 当前是第几个菜单处于激活状态
const current = ref(99999);
// 外层内容的样式，初始时处于底层，且透明
const contentStyle = ref({
    zIndex: -1,
    opacity: 0,
});

const active = ref(false); // 下拉菜单的状态
const contentHeight = ref(0);
const leDropdownContentPopupRef = ref(null);
const windowTop = ref(0);
uni.getSystemInfo({
    success(e) {
        windowTop.value = e.windowTop;
    },
});

// 点击菜单
const menuClick = (index) => {
    getContentHeight();
    switch (props.menuList[index].type) {
        case 'sort':
            onSort(index);
            break;
        case 'click':
            onClick(index);
            break;
        default:
            // 如果点击时的索引和当前激活项索引相同，意味着点击了激活项，需要收起下拉菜单
            if (index === current.value) {
                close();
                return;
            }
            open(index);
            break;
    }
};
// 打开当前筛选窗
const open = (index) => {
    // 展开时，设置下拉内容的样式
    active.value = true;
    contentStyle.value.zIndex = 11;
    contentStyle.value.opacity = 1;
    contentStyle.value.bottom = '0px';
    contentStyle.value.top = '80rpx';
    // 标记展开状态以及当前展开项的索引
    current.value = index;
    emits('open', current.value);
};
// 关闭当前筛选窗
const close = () => {
    active.value = false;
    contentStyle.value.opacity = 0;
    // 等动画结束后，再移除下拉菜单中的内容，否则直接移除，也就没有下拉菜单收起的效果了
    setTimeout(() => {
        contentStyle.value.zIndex = -1;
        current.value = 99999;
        contentStyle.value.bottom = `calc(100vh - ${contentHeight.value + windowTop.value}px)`;
        contentStyle.value.top = 'auto';
    }, props.duration);
    emits('close', current.value);
};
// 获取下拉菜单内容的高度
const getContentHeight = () => {
    uni.createSelectorQuery()
        .in(instance)
        .selectAll('.dropdown-menu')
        .boundingClientRect()
        .exec((data) => {
            contentHeight.value = data[0][0].bottom;
        });
};
// 点击排序
const onSort = (index) => {
    const type = current.value === 99999 ? current.value : props.menuList[current.value].type;
    switch (type) {
        case 'sort':
        case 'click':
        case 99999:
            start();
            break;
        default:
            close();
            setTimeout(() => {
                start();
            }, props.duration);
            break;
    }

    function start() {
        const menuList = cloneDeep(props.menuList);
        current.value = index;
        menuList[index].value = !menuList[index].value ? 'asc' : menuList[index].value === 'asc' ? 'desc' : null;
        emits('update:menuList', menuList);
        emits('onConfirm', menuList[index]);
    }
};
// 点击按钮
const onClick = (index) => {
    const type = current.value === 99999 ? current.value : props.menuList[current.value].type;
    switch (type) {
        case 'sort':
        case 'click':
        case 99999:
            start();
            break;
        default:
            close();
            setTimeout(() => {
                start();
            }, props.duration);
            break;
    }

    function start() {
        const menuList = cloneDeep(props.menuList);
        current.value = index;
        emits('onConfirm', menuList[index]);
    }
};
// 单选列表选中事件
const onSelectCell = (sItem, index) => {
    const menuList = cloneDeep(props.menuList);
    menuList[index].title = sItem.label;
    menuList[index].value = sItem.value;
    console.log(menuList);
    emits('update:menuList', menuList);
    close();
    emits('onConfirm', menuList[index]);
};
// 筛选单选选中事件
const onRadioFilter = (sIndex, ssItem, index) => {
    const menuList = cloneDeep(props.menuList);
    menuList[index].children[sIndex].value = ssItem.value;
    emits('update:menuList', menuList);
    emits('onChange', menuList[index], sIndex);
};
// 筛选多选选中事件
const onCheckboxFilter = (sIndex, ssItem, index) => {
    const menuList = cloneDeep(props.menuList);
    const indexs = menuList[index].children[sIndex].value.indexOf(ssItem.value);
    if (indexs !== -1) {
        menuList[index].children[sIndex].value.splice(indexs, 1);
    } else {
        menuList[index].children[sIndex].value.push(ssItem.value);
    }
    emits('update:menuList', menuList);
    emits('onChange', menuList[index], sIndex);
};
// 滑块值的变化事件
const onSliderChange = (event, sIndex, ssItem, index) => {
    const menuList = cloneDeep(props.menuList);
    menuList[index].children[sIndex].value = event.detail.value;
    emits('update:menuList', menuList);
    emits('onChange', menuList[index], sIndex);
};
// 筛选选中事件
const onSelectFilter = (sIndex, ssItem, index) => {
    const menuList = cloneDeep(props.menuList);
    menuList[index].active[sIndex] = ssItem.value;
    emits('update:menuList', menuList);
    emits('onChange', menuList[index], sIndex);
};
// 重置筛选
const onFilterReset = (item, index) => {
    const menuList = cloneDeep(props.menuList);
    menuList[index].children.forEach((items, indexs) => {
        items.value = initMenuList[index].children[indexs].value;
    });
    emits('update:menuList', menuList);
    // close();
    // emits("onConfirm",menuList[index])
};
// 确定筛选
const onFilterConfirm = (item, index) => {
    close();
    const menuList = cloneDeep(props.menuList);
    emits('onConfirm', menuList[index]);
};
const bindFun = (data) => {
    return data;
};
onMounted(() => {
    getContentHeight();
});
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    align-items: center;
    height: 100%;
}
.dropdown {
    width: 100%;
    position: relative;
    background-color: #fff;
    .dropdown-menu {
        display: flex;
        position: relative;
        align-items: center;
        z-index: 11;
        padding: 24rpx;
        .dropdown-menu-title {
            display: flex;
            align-items: center;
            .line {
                width: 4px;
                height: 12px;
                border-radius: 10px;
                margin-right: 6px;
                background-color: #2979ff;
            }

            font-size: $uni-font-size-m;
        }
        .dropdown-menu-item {
            height: 100%;
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .dropdown-menu-item-text {
                font-size: 24rpx;
            }
            .dropdown-menu-item-arrow {
                margin-left: 6rpx;
                transition: transform 0.3s;
                align-items: center;
                display: flex;
                position: relative;
                width: 10rpx;
                height: 100%;
                &::before {
                    content: '';
                    position: absolute;
                    top: calc(50% - 8rpx);
                    right: -2rpx;
                    transform: translateY(-50%);
                    border: 6rpx solid transparent;
                    border-bottom-color: #c1c1c1;
                }
                &::after {
                    content: '';
                    position: absolute;
                    top: calc(50% + 8rpx);
                    right: -2rpx;
                    transform: translateY(-50%);
                    border: 6rpx solid transparent;
                    border-top-color: #c1c1c1;
                }
            }
            .dropdown-menu-item-arrow_top {
                &::before {
                    border-bottom-color: $uni-color-primary;
                }
            }
            .dropdown-menu-item-arrow_bottom {
                &::after {
                    border-top-color: $uni-color-primary;
                }
            }
            .dropdown-menu-item-basicarrow {
                margin-left: 6rpx;
                transition: transform 0.3s;
                align-items: center;
                display: flex;
                position: relative;
                border: 6rpx solid transparent;
                border-bottom: 0rpx solid transparent;
                border-top-color: #c1c1c1;
            }
            .dropdown-menu-item-basicarrow_rotate {
                transform: rotate(180deg);
                border-top-color: $uni-color-primary;
            }
        }
    }
    .dropdown-content {
        position: absolute;
        z-index: 8;
        width: 100%;
        left: 0;
        bottom: 0;
        overflow: hidden;
        .dropdown-content-mask {
            position: absolute;
            z-index: 9;
            background: rgb(0 0 0 / 30%);
            width: 100%;
            left: 0;
            top: 0;
            bottom: 0;
        }
        .dropdown-content-popup {
            position: relative;
            max-height: 100%;
            overflow: auto;
            overscroll-behavior: contain;
            z-index: 10;
            transition: all 0.3s;
            transform: translate3d(0, -100%, 0);
        }
    }
}
.dropdown-ceiling {
    position: sticky;
    top: 0;
    z-index: 1;
}
.dropdown-popup-content {
    font-size: 28rpx;
    border-radius: 0 0 20rpx 20rpx;
    background-color: #fff;
}

// 单选列表
.dropdown-cell {
    padding: 0 30rpx;
    .dropdown-cell-item {
        padding: 20rpx 0;
        color: #333;
        font-size: 28rpx;
        border-bottom: 1rpx solid #d5d5d5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .dropdown-cell-active-text {
            flex: 1;
            padding-right: 20rpx;
        }
    }
    .dropdown-cell-item:last-child {
        border-bottom: 0rpx solid #d5d5d5;
    }
    .dropdown-cell-active {
        color: $uni-color-primary;
        .dropdown-cell-active-icon {
            width: 12rpx;
            height: 28rpx;
            margin-right: 10rpx;
            border-color: $uni-color-primary;
            border-style: solid;
            border-width: 0 4rpx 4rpx 0;
            transform: rotate(45deg);
        }
    }
}

// 筛选
.dropdown-filter {
    .dropdown-filter-item {
        padding: 0 26rpx;
    }
    .dropdown-filter-title {
        padding-top: 34rpx;
        margin-bottom: 18rpx;
        color: #333;
        font-size: 24rpx;
        .dropdown-filter-subtitle {
            margin-left: 10rpx;
            color: $uni-color-primary;
        }
    }
    .dropdown-filter-content {
        display: flex;
        flex-wrap: wrap;
    }
    .dropdown-filter-box {
        width: 200rpx;
        margin-right: 30rpx;
        margin-bottom: 14rpx;
        padding: 18rpx 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #333;
        background-color: #f5f5f5;
        border-radius: 999rpx;
    }
    .dropdown-filter-box-active {
        color: $uni-color-primary;
        background-color: rgba(43 131 215 / 4%);
    }
}
.dropdown-footer {
    display: flex;
    align-items: center;
    margin-top: 14rpx;
    .dropdown-reset {
        flex: 1;
        margin: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 68rpx;
        font-size: 28rpx;
        background-color: #fff;
        color: $uni-color-primary;
        border: 2rpx solid $uni-color-primary;
        border-radius: 999rpx;
    }
    .dropdown-confirm {
        flex: 1;
        margin: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 68rpx;
        font-size: 28rpx;
        background-color: $uni-color-primary;
        border: 2rpx solid $uni-color-primary;
        color: #fff;
        border-radius: 999rpx;
    }
}
</style>
