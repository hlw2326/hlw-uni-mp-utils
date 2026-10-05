/**
 * 具有消息提示属性的响应体对象
 */
export interface ToastRes {
    /** 提示文案 */
    msg?: string;
    /** 是否为模态弹窗 */
    modal?: boolean;
    /** 模态弹窗配置 */
    modalOptions?: UniApp.ShowModalOptions;
}

/**
 * 提示回调函数类型 (confirm 为 true 表示确定，false 为取消)
 */
export type ToastCallback = (confirm: boolean) => void;

/**
 * 统一消息提示工具接口
 */
export interface HlwMsg {
    /** 显示轻提示或模态确认框 (支持回调与 Promise) */
    toast(opts: UniApp.ShowToastOptions | ToastRes | string, callback?: ToastCallback): Promise<boolean>;
    /** 成功提示框 */
    success(msg: string): void;
    /** 失败提示框 */
    error(msg: string): void;
    /** 显示全局加载动画 */
    showLoading(msg?: string): void;
    /** 隐藏全局加载动画 */
    hideLoading(): void;
    /** 弹出模态确认弹窗 */
    modal(opts?: UniApp.ShowModalOptions): Promise<boolean>;
}

/**
 * 显示普通 toast 或 modal 确认弹窗
 */
export function toast(opts: UniApp.ShowToastOptions | ToastRes | string, callback?: ToastCallback): Promise<boolean> {
    let msg = "";
    let isModal = false;
    let modalOptions: UniApp.ShowModalOptions | undefined;
    let toastOptions: Partial<UniApp.ShowToastOptions> | undefined;

    if (typeof opts === "string") {
        msg = opts;
    } else if ("msg" in opts) {
        msg = opts.msg || "";
        isModal = Boolean(opts.modal);
        modalOptions = opts.modalOptions;
    } else if ("title" in opts) {
        msg = opts.title || "";
        toastOptions = opts;
    }

    if (!msg) {
        callback?.(true);
        return Promise.resolve(true);
    }

    if (isModal) {
        return modal({
            ...modalOptions,
            content: msg,
        }).then((confirm) => {
            callback?.(confirm);
            return confirm;
        });
    }

    uni.showToast({
        title: msg,
        icon: toastOptions?.icon || "none",
        image: toastOptions?.image,
        duration: toastOptions?.duration || 2000,
        mask: toastOptions?.mask || false,
        position: toastOptions?.position || "center",
    });

    callback?.(true);
    return Promise.resolve(true);
}

/**
 * 显示成功提示
 */
export function success(msg: string): void {
    if (!msg) {
        return;
    }
    uni.showToast({ title: msg, icon: "success", duration: 2000 });
}

/**
 * 显示失败提示
 */
export function error(msg: string): void {
    if (!msg) {
        return;
    }
    uni.showToast({ title: msg, icon: "error", duration: 2000 });
}

/**
 * 显示全局加载中遮罩
 */
export function showLoading(msg = "加载中..."): void {
    uni.showLoading({ title: msg, mask: true });
}

/**
 * 隐藏全局加载中遮罩
 */
export function hideLoading(): void {
    uni.hideLoading();
}

/**
 * 弹出模态确认窗
 */
export function modal(opts: UniApp.ShowModalOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
        const {
            title = "提示",
            content,
            confirmText = "确定",
            cancelText = "取消",
            confirmColor = "#3b82f6",
            cancelColor = "#999999",
            showCancel = true,
        } = opts || {};

        uni.showModal({
            title,
            content,
            confirmText,
            cancelText,
            confirmColor,
            cancelColor,
            showCancel,
            success: (res) => resolve(Boolean(res.confirm)),
            fail: () => resolve(false),
        });
    });
}

/**
 * 消息提示工具单例
 */
export const msg: HlwMsg = {
    toast,
    success,
    error,
    showLoading,
    hideLoading,
    modal,
};

/**
 * 统一提示 Hook 别名
 */
export const useMsg = (): HlwMsg => msg;

/**
 * 全局统一挂载门面对象
 */
export const hlw = {
    $msg: msg,
};

export type HlwInstance = typeof hlw;
