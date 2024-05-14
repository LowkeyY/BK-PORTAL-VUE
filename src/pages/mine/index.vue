<script lang="ts" setup>
import { isBjouUser, isOuchnUser } from '@/utils';
import { userInfoApi, ouchnUserInfoApi, portalUserInfoApi, userRoleApi } from '@/services/user';
import { Toast } from '@/utils/uniapi/prompt';
import { bkMineGirds, bkMineInfo } from '@/utils/mineConstants';
import { useAuthStore } from '@/store/modules/auth';
import { useUserStore } from '@/store/modules/user';
import { UserRoleEnums } from '@/enums/appEnum';
import { getPortalAvatar } from '@/utils';
import { getBaseUrl } from '@/utils/env';
import { handleGridsClick, handleJumpToPage } from '@/utils/handle';
import { isArray } from '@/utils/is';
import { setStorage } from '@/utils';
import { StorageEnum } from '@/enums/storageEnum';
import { useSystem } from '@/hooks/app/useSystem';
import { px2rpx } from '@/utils/uniapi';
const statusBarHeight = `${20 + px2rpx(useSystem().statusBarHeight || 0)}rpx`;

const loading = ref(false);
const router = useRouter();
const useStore = useAuthStore();
const useUser = useUserStore();
const curUserInfo: Record<string, any> = ref({});
const ouchnUserInfo: Record<string, any> = ref({});
const selectRolesRef = ref();
const currentRole = computed(() => {
    const orgCode = useUser.orgCode;
    const cur = isArray(useUser.roleList) && useUser.roleList.find((item) => item.orgCode === orgCode)?.orgName;
    return cur || '';
});
const { PORTAL_SERVER } = getBaseUrl();
const curFileUrl = `${PORTAL_SERVER}/file/downloadFile`;

const goSettings = () => {
    router.push({ name: 'settings' });
};

// const queryInfo =async () =>{
//     loading.value = true;
//     const params = {
//         // eslint-disable-next-line camelcase
//         access_token: useStore.portalToken,
//     };
//     const { code, message, data } = isBjouUser()?await userInfoApi():await portalUserInfoApi(params as AccessTokenParams);
//     if (code===0) {
//         curUserInfo.value = data;
//     } else {
//         Toast(message);
//     }
//     loading.value = false;
// };
// const queryOuchnInfo =async () =>{
//     loading.value = true;
//     const { code, message, data } = await ouchnUserInfoApi();
//     if (code===0) {
//         ouchnUserInfo.value = isArray(data) ? data[0] : {};
//     } else {
//         Toast(message);
//     }
//     loading.value = false;
// };
const queryUserRole = async () => {
    try {
        const { data = [], message = '请稍后再试', code } = await userRoleApi();
        if (code === 0) {
            useUser.roleList = data;
        } else {
            Toast(message);
        }
    } catch (err: any) {
        return Promise.reject(err);
    }
};
const handleLoginByRole = (role: string) => {
    if (role !== useUser.orgCode) {
        useUser.orgCode = role;
        setStorage({ [StorageEnum.ORG_CODE]: role });
        if (role === UserRoleEnums.BJOU_STUDENT) {
            router.replace({
                name: 'Home',
            });
        }
        if (role === UserRoleEnums.OUCHN_STUDENT) {
            router.replace({
                name: 'OuchnHome',
            });
        }
    }
};
const handlePersonalInfo = () => {
    handleJumpToPage('editPersonalInfo');
};
onShow(async () => {
    loading.value = true;
    await useUser.queryInfo();
    await queryUserRole();
    curUserInfo.value = useUser.curUserInfo;
    if (isOuchnUser()) {
        await useUser.queryOuchnInfo();
        ouchnUserInfo.value = useUser.ouchnUserInfo;
    }
    loading.value = false;
});
</script>

<template>
    <LoadingIcon :loading="loading" />
    <view class="mypage-container">
        <view class="mypage-top-box" :style="{ paddingTop: statusBarHeight }">
            <view class="mypage-top-content">
                <view class="mypage-header">
                    <image class="avatar" :src="getPortalAvatar(curFileUrl, curUserInfo?.headImg || ouchnUserInfo?.headImg)" mode=""></image>
                    <view class="userinfo">
                        <view class="top-text">
                            <view class="name">
                                <text style="margin-right: 10rpx">{{ curUserInfo?.userName }}</text>
                                <uni-tag v-if="isOuchnUser()" :text="ouchnUserInfo?.studentState" size="small" type="primary" />
                            </view>
                            <uni-icons type="gear-filled" color="#fff" size="30" @click="goSettings"></uni-icons>
                        </view>
                        <view class="bottom-text">
                            <view class="accountName"> 学号: {{ curUserInfo?.studentNumber || ouchnUserInfo?.studentNumber || '-' }} </view>
                            <text class="text">{{ `层次：${curUserInfo?.arrangement || ouchnUserInfo?.majorLevel || '-'}` }}</text>
                        </view>
                    </view>
                </view>
                <view class="administrative">
                    {{ ouchnUserInfo?.majorName || curUserInfo?.administrative || curUserInfo?.major }}
                </view>
                <view class="info">
                    <span>
                        {{ `招生年度：${curUserInfo?.enrollmentdate || ouchnUserInfo?.schoolYear || '-'}` }}
                    </span>
                    <span v-if="isBjouUser()">
                        {{ `学制：${curUserInfo?.educational || '-'}` }}
                    </span>
                    <span v-if="isOuchnUser()">
                        {{ `招生季度：${ouchnUserInfo?.registNumber || '-'}` }}
                    </span>
                </view>
                <view v-if="isBjouUser()" class="time">
                    <text>学籍有效到期时间：</text>
                    <text>2025/03/08</text>
                </view>
                <view v-if="isOuchnUser()">
                    <view class="info">
                        <span>
                            {{ `规则号：${ouchnUserInfo?.ruleNumber || '-'}` }}
                        </span>
                        <span>
                            {{ `电子注册证：${ouchnUserInfo?.registNumber || '-'}` }}
                        </span>
                    </view>
                    <view class="info">
                        <span>
                            {{ `班名称：${ouchnUserInfo?.className || '-'}` }}
                        </span>
                        <span>
                            {{ `班号：${ouchnUserInfo?.classNumber || '-'}` }}
                        </span>
                    </view>
                </view>
            </view>
            <image src="@/static/images/bgImages/mineBg.png" class="bg" mode="widthFix" />
            <view class="userinfo-operate" />
        </view>
        <Menu v-if="isBjouUser()" :menu-list="bkMineGirds" :column="4" @handle-grids-click="handleGridsClick" />
        <uni-section v-if="useUser.roleList.length > 1" title="切换身份">
            <template #right>
                <view style="display: flex; align-items: center" @click="selectRolesRef.toggle()">
                    <uni-icons type="staff-filled" size="22" color="#2979ff"></uni-icons>
                    <text color="#2979ff">{{ currentRole }}</text>
                </view>
            </template>
        </uni-section>
        <view class="userinfo-box">
            <uni-section class="mb-10" type="line" title="个人信息">
                <template #right>
                    <uni-icons type="compose" size="22" color="#2979ff" @click="handlePersonalInfo"></uni-icons>
                </template>
            </uni-section>
        </view>
        <uni-list v-for="(item, index) in bkMineInfo" :key="item.id" :index="index">
            <uni-list-item :show-extra-icon="true" :right-text="curUserInfo[item.key]" :extra-icon="item.extraIcon" :title="item.text" />
        </uni-list>
    </view>
    <select-roles ref="selectRolesRef" @select-role="handleLoginByRole" />
    <tab-bar />
</template>

<style lang="scss" scoped>
.mypage-container {
    font-size: $uni-font-size-base;
    color: $uni-font-color-white;
    box-sizing: border-box;
    background-color: $uni-bg-color;
}
.mypage-top-box {
    margin: 0 auto;
    padding: $uni-container-padding;
    background-size: cover;
    overflow: hidden;
    position: relative;
    height: 100%;
    .bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    .userinfo-operate {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 2;
        background-color: $uni-bg-color;
        border-radius: 40rpx 40rpx 0 0;
        padding-top: 20rpx;
    }
    .mypage-top-content {
        position: relative;
        width: 100%;
        z-index: 2;
        padding-bottom: 20rpx;
    }
}
.mypage-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avatar {
        width: 145rpx;
        height: 145rpx;
        border-radius: 90rpx;
        margin-right: 20rpx;
    }
    .userinfo {
        flex: 1;
        .top-text {
            font-size: 40rpx;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .name {
                display: flex;
                align-items: center;
                margin-bottom: 20rpx;
                font-weight: bold;
            }
        }
        .bottom-text {
            display: flex;
            width: 100%;
            margin-top: 20rpx;
            justify-content: space-between;
        }
    }
}
.administrative {
    padding: $uni-list-padding;
}
.info {
    display: flex;
    width: 90%;
    padding-left: 16px;
    justify-content: space-between;
    margin-bottom: 20rpx;
}
.time {
    padding-left: 16px;
}
.grid-item-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    .icon {
        width: 56rpx;
        height: 56rpx;
    }
    .text {
        margin-top: 20rpx;
        font-size: 26rpx;
        color: $uni-text-color;
    }
}
.userinfo-box {
    position: relative;
    z-index: 2;
}
</style>
