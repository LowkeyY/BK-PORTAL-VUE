/**
 * 交互反馈
 * https://uniapp.dcloud.io/api/ui/prompt.html
 */
import { createApp } from '@/main';

/**
 * 显示消息提示框
 * @param title
 * @param options
 * @constructor
 */
export function Toast(title: string, options?: Partial<UniApp.ShowToastOptions>) {
    uni.showToast({
        title,
        duration: 1500,
        icon: 'none',
        mask: true,
        ...options,
    });
}

/**
 * 隐藏消息提示框
 */
export function HideToast() {
    uni.hideToast();
}

/**
 * 显示 loading 提示框
 * @param title
 * @param options
 * @constructor
 */
export function Loading(title: string, options?: Partial<UniApp.ShowLoadingOptions>) {
    uni.showLoading({
        title,
        mask: true,
        ...options,
    });
}

/**
 * 隐藏 loading 提示框
 */
export function HideLoading() {
    uni.hideLoading();
}

/**
 * 显示模态弹窗，可以只有一个确定按钮，也可以同时有确定和取消按钮
 * @param options
 * @constructor
 */
export function Modal(options: UniApp.ShowModalOptions) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            ...options,
            success: (res) => {
                resolve(res);
            },
            fail: (res) => {
                reject(res);
            },
        });
    });
}

/**
 * 从底部向上弹出操作菜单
 * @param options
 * @constructor
 */
export function ActionSheet(options: UniApp.ShowActionSheetOptions) {
    return new Promise((resolve, reject) => {
        uni.showActionSheet({
            ...options,
            success: (res) => {
                resolve(res);
            },
            fail: (res) => {
                reject(res);
            },
        });
    });
}

/**
 * @description: 自定义MOdal
 * @param {string} title
 * @param {string} content
 * @param {Function} onConfirm
 * @return {*}
 */
interface typeOptions {
    title?: string;
    content?: string;
    type?: string;
    modalType?: string;
    onConfirm?: Function;
    onCancel?: Function;
}
export function prettifyModal(options: typeOptions) {
    const { app } = createApp();
    const { title, content, type, modalType, onConfirm, onCancel } = options;

    app._context.config.globalProperties.$showPopup({
        title,
        content,
        type,
        onConfirm,
        modalType,
        onCancel,
    });
}
