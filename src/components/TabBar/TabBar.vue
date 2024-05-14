<template>
    <view
        class="tab-bar"
        :style="{
            background: background,
            fontSize: `${textSize}rpx`,
            'border-top': `1rpx solid ${borderColor}`,
        }"
    >
        <template v-for="(i, idx) in tabBar" :key="i.pagePath">
            <view
                class="tab-bar-item"
                :class="isActive(i.pagePath) ? 'active' : ''"
                :style="{
                    background: isActive(i.pagePath) ? i.background : '',
                }"
                :data-idx="idx"
                :data-path="i.pagePath"
                @click="handelSwitchTab"
            >
                <view class="tab-bar-image w-full h-full flex justify-center items-center" :style="{ '--activeColor': i.background }">
                    <image
                        class="special-image-pic"
                        :style="{
                            width: `${imageSize}rpx`,
                            height: `${imageSize}rpx`,
                        }"
                        mode="aspectFit"
                        :src="isActive(i.pagePath) ? i.selectedIconPath : i.iconPath"
                    ></image>
                </view>
                <view :class="['tab-bar-text', isActive(i.pagePath) && 'active']">{{ i.text }}</view>
            </view>
        </template>
    </view>
</template>

<script setup lang="ts" name="TabBar">
import { useUserStore } from '@/store/modules/user';
const router = useRouter();
const useUser = useUserStore();
export interface Tabs {
    pagePath: string;
    iconPath: string;
    selectedIconPath: string;
    text?: string;
    background?: string;
}
interface Props {
    bg?: string;
    borderColor?: string;
    imageSize?: number | null;
    textSize?: number | null;
    defaultColor?: string;
    activeColor?: string;
}

const props = defineProps<Props>();
const defaultColor = ref('');
const activeColor = ref('');
const background = ref('');
const borderColor = ref('');
const imageSize = ref(null);
const textSize = ref(null);
const currentRoute = ref('');
const pages = getCurrentPages();
const activeRoute = pages[pages.length - 1]?.$page.route;
const tabBar = computed(() => useUser.getUserTabBar);
const isActive = (path: string) => {
    return currentRoute.value === `${path}`;
};

// 点击切换
const handelSwitchTab = (e: any) => {
    const { path } = e.currentTarget.dataset;
    router.replace({
        path,
    });
};

watch(
    () => currentRoute.value,
    (val) => {
        currentRoute.value = val;
    },
    { deep: true, immediate: true }
);

const initializationStyle = () => {
    nextTick(() => {
        // 初始化tab-bar样式
        background.value = props.bg ?? '#fff';
        defaultColor.value = props.defaultColor ?? '#999999';
        activeColor.value = props.activeColor ?? 'orange';
        borderColor.value = props.borderColor ?? '#c8c7cc';
        imageSize.value = props.imageSize ?? 48;
        textSize.value = props.textSize ?? 20;
        currentRoute.value = activeRoute;
        // 修改系统底部安全区颜色
        // #ifdef APP-PLUS
        let Color = plus.android.importClass('android.graphics.Color');
        plus.android.importClass('android.view.Window');
        let mainActivity = plus.android.runtimeMainActivity();
        let window_android = mainActivity.getWindow();
        window_android.setNavigationBarColor(Color.parseColor(background.value));
        // #endif
    });
};

onMounted(() => {
    initializationStyle();
});
</script>

<style lang="scss" scoped>
.tab-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    z-index: 99;
    .tab-bar-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        flex: 1;
        text-align: center;
        .tab-bar-text {
            color: #949494;
        }
    }
    .active {
        color: #2b83d7 !important;
    }
}
</style>
