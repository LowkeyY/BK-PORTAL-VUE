<!-- eslint-disable vue/no-parsing-error -->

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
    <view class="container">
        <image src="@/static/images/bgImages/loginBg.png" class="bg" />
        <view class="content">
            <image class="logo" src="@/static/images/logos/loginLogo.png" mode="widthFix" />
            <view class="form-wrap">
                <uni-forms ref="loginFormRef" :model-value="loginForm" :rules="rules">
                    <uni-forms-item name="username">
                        <template #default>
                            <view class="form-item">
                                <view class="icon">
                                    <image style="width: 22px; height: 22px;" src="@/static/images/spirit/user.png" />
                                </view>
                                <uni-easyinput
                                    v-model="loginForm.username"
                                    :input-border="false"
                                    class="account-input"
                                    trim="all"
                                    type="text"
                                    placeholder="请输入用户名"
                                />
                            </view>
                        </template>
                    </uni-forms-item>
                    <uni-forms-item name="password">
                        <template #default>
                            <view class="form-item">
                                <view class="icon">
                                    <image style="width: 22px; height: 22px;" src="@/static/images/spirit/lock.png" />
                                </view>
                                <uni-easyinput v-model="loginForm.password" :input-border="false" trim="all" type="password" placeholder="请输入密码" />
                            </view>
                        </template>
                    </uni-forms-item>
                </uni-forms>
            </view>
            <view class="extra-content">
                <a>登录提示</a>
                <a>忘记密码？</a>
            </view>
            <button type="primary" @click="submit">登录</button>
            <view class="tip-box"></view>
        </view>
    </view>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';

import storage from '@/utils/storage';

const loginFormRef = ref();
const userStore = useAuthStore();
const loginForm = ref({
    username: storage.get('username'),
    password: '',
});
const rules = {
    username: {
        rules: [
            {
                required: true,
                errorMessage: '请输入姓名',
            },
        ],
    },
    password: {
        rules: [
            { required: true, errorMessage: '请输入密码' },
            { minLength: 6, maxLength: 18, errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符' },
        ],
    },
};
const router = useRouter();

const submit = () => {
   
    loginFormRef.value.validate().then(() => {
       
        userStore
            .singleSignOn(loginForm.value)
            .then((res) => {
            
                if (res) {
                    router.replaceAll({
                        name: 'Home',
                    });
                }
            })
            .catch(() => { console.log(2);});
    });
};
</script>
<style lang="scss" scoped>
::v-deep .uni-easyinput__content {
  height: 100%;
  border-radius: 0 8px 8px 0;
}
.container {
  margin: 0 auto;
  background-size: cover;
  height: 100vh;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .content {
    position: absolute;
    width: 100%;
    z-index: 2;
    text-align: center;
    padding: 0 80rpx;
    .logo {
      margin-top: 100rpx;
      width: 360rpx;
    }
    .form-wrap {
      margin-top: 80rpx;
      .form-item {
        display: flex;
        height: 44px;
        .icon {
          width: 44px;
          height: 44px;
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px 0 0 8px;
        }
      }
    }
    .extra-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      margin-bottom: 22px;
    }
  }
}
</style>
