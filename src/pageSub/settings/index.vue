<!--
 * @Author: Lowkey
 * @Date: 2023-12-27 15:57:23
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 21:59:35
 * @FilePath: \BK-Portal-VUE\src\pageSub\settings\index.vue
 * @Description:
-->
<template>
    <view>
        <uni-list>
            <uni-list-item
                :show-extra-icon="true"
                :extra-icon="{
                    color: '#918d8d',
                    size: '22',
                    type: 'trash',
                }"
                title="清理缓存"
                :right-text="cache"
                :show-arrow="false"
                clickable
                @click="() => handleClearCache()"
            />
            <uni-list-item
                :show-extra-icon="true"
                :extra-icon=" {
                    color: '#918d8d',
                    size: '22',
                    type: 'info',
                }"
                title="版本信息"
                :right-text="versionNumber"
                :show-arrow="false"
                clickable
                @click="() => handleVersion()"
            />
            <uni-list-item
                :show-extra-icon="true"
                :extra-icon=" {
                    color: '#918d8d',
                    size: '22',
                    type: 'paperplane',
                }"
                title="意见反馈"
                :show-arrow="true"
                clickable
                @click="() => handleFeedback()"
            />
            <uni-list-item
                :show-extra-icon="true"
                :extra-icon=" {
                    color: '#918d8d',
                    size: '22',
                    type: 'help',
                }"
                title="使用帮助"
                :show-arrow="true"
                clickable
                @click="() => handleHelp()"
            />
        </uni-list>
        <view class="btn-box">
            <button type="primary" class="btn" @click="showExitAlert">退出</button>
        </view>
        <!-- 清理缓存提示框-->
        <uni-popup ref="cacheDialog" type="dialog">
            <uni-popup-dialog
                type="warn"
                cancel-text="取消"
                confirm-text="确定"
                title="清理缓存"
                content="你确定要清理全部缓存吗？"
                @confirm="confirmClear"
            ></uni-popup-dialog>
        </uni-popup>
        <!--        退出提示框-->
        <uni-popup ref="alertDialog" type="dialog">
            <uni-popup-dialog
                type="info"
                cancel-text="立即退出"
                confirm-text="暂不"
                title="退出"
                content="你确定要退出学习状态吗？"
                @close="dialogExit"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import { router } from '@/router';
import { renderSize } from '@/utils';
import { Toast } from '@/utils/uniapi/prompt';

const alertDialog = ref();
const cacheDialog = ref();
const authStore = useAuthStore();
const cache=ref('0');
const versionNumber=ref('');
const handleFeedback = ()=>{
    router.push({ name: 'SuggestionForm' });
};

const showExitAlert = () => {
    alertDialog.value?.open();
};
const dialogExit = () => {
    authStore.loginOut().then(() => {
        router.push({ name: 'Login' });
    });
};
const handleClearCache = () => {
    cacheDialog.value?.open();
};
const confirmClear = () => {
    Toast('清理成功',{ icon: 'success' });
    cache.value='0b';
    // 清理缓存
    // #ifdef APP
    let that = this;
    let os = plus.os.name;
    if (os == 'Android') {
        let main = plus.android.runtimeMainActivity();
        let sdRoot = main.getCacheDir();
        let files = plus.android.invoke(sdRoot, 'listFiles');
        let len = files.length;
        for (let i = 0; i < len; i++) {
            let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
            plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
                if (entry.isDirectory) {
                    entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录
                        uni.showToast({
                            icon: 'none',
                            title: '缓存清理完成',
                            duration: 2000
                        });
                        that.formatSize(); // 重新计算缓存
                    }, function(e) {
                        console.log(e.message);
                    });
                } else {
                    entry.remove();
                }
            }, function(e) {
                console.log('文件路径读取失败');
            });
        }
    } else { // ios
        plus.cache.clear(function() {
            uni.showToast({
                icon: 'none',
                title: '缓存清理完成',
                duration: 2000
            });
            that.formatSize();
        });
    }
    // #endif
};
onLoad(()=>{
    uni.getStorageInfo({
        success: function (res) {
            cache.value=renderSize(res.currentSize);
            console.log(res.currentSize,'res.currentSize');
        }
    });
    // 获取当前app的版本
    const systemInfo = uni.getSystemInfoSync();
    // 应用程序版本号
    // #ifdef APP
    versionNumber.value = systemInfo.appWgtVersion;
    // #endif
    // #ifdef H5
    versionNumber.value= systemInfo.appVersion;
    // #endif
    // #ifdef MP-WEIXIN
    const accountInfo = wx.getAccountInfoSync();
    versionNumber.value = accountInfo.miniProgram.version; // 小程序 版本号
    // #endif

});
</script>

<style lang="scss" scoped>
.btn-box {
  padding: 40rpx 80rpx;
  .btn {
    background: linear-gradient(#fad25c, #f77b26);
    border: 0;
  }
}
</style>
