/**
 * 路由跳转动作类型
 */
export type NavigateType =
    | "navigateTo"
    | "redirectTo"
    | "switchTab"
    | "reLaunch"
    | "navigateBack"
    | "miniprogram"
    | (string & {});

/**
 * 路由配置项
 */
export interface NavigateOptions {
    /** 是否静默失败（不弹窗提示错误，默认 false） */
    silent?: boolean;
    /** 跳转失败回调函数 */
    onFail?: (message: string) => void;
    /** 返回上级页面层数（仅 navigateBack 有效，默认 1） */
    delta?: number;
    /** 打开外部小程序的目标页面路径（仅 miniprogram 有效） */
    path?: string;
    /** 打开外部小程序的版本（仅 miniprogram 有效） */
    envVersion?: "develop" | "trial" | "release";
    /** 传递给外部小程序的额外参数（仅 miniprogram 有效） */
    extraData?: Record<string, unknown>;
    /** 附加到 URL 的 Query 查询参数（自动拼接与编码） */
    params?: Record<string, string | number | boolean | undefined | null>;
}

type UniFail = { errMsg?: string };

/**
 * 规范化 URL 路径并拼接 Query 参数
 */
function resolveUrl(url: string, params?: Record<string, unknown>): string {
    let target = url.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://") && !target.startsWith("/")) {
        target = "/" + target;
    }
    if (!params) return target;

    const entries = Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "",
    );
    if (!entries.length) return target;

    const query = entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
    return target.includes("?") ? `${target}&${query}` : `${target}?${query}`;
}

/**
 * 统一失败提示与回调处理
 */
function handleFail(message: string, options?: NavigateOptions): boolean {
    if (!options?.silent) {
        uni.showToast({ title: message, icon: "none" });
    }
    options?.onFail?.(message);
    return false;
}

/**
 * 页面路由统一分发
 *
 * @param type 跳转动作类型（默认 navigateTo）
 * @param url 跳转目标路径或目标小程序 AppId
 * @param options 额外的控制与传参选项
 * @returns 是否跳转成功
 */
export function navigate(
    type: NavigateType = "navigateTo",
    url = "",
    options: NavigateOptions = {},
): Promise<boolean> {
    // 1. 返回上一页
    if (type === "navigateBack") {
        return new Promise((resolve) => {
            uni.navigateBack({
                delta: options.delta || 1,
                success: () => resolve(true),
                fail: (err: UniFail) => {
                    handleFail(err?.errMsg || "返回上一页失败", options);
                    resolve(false);
                },
            });
        });
    }

    if (!url) {
        handleFail("跳转目标未配置", options);
        return Promise.resolve(false);
    }

    // 2. 跳转外部小程序
    if (type === "miniprogram") {
        return new Promise((resolve) => {
            uni.navigateToMiniProgram({
                appId: url,
                path: options.path ? resolveUrl(options.path, options.params) : "",
                envVersion: options.envVersion || "release",
                extraData: options.extraData,
                success: () => resolve(true),
                fail: (err: UniFail) => {
                    handleFail(err?.errMsg || "打开小程序失败", options);
                    resolve(false);
                },
            });
        });
    }

    // 3. 应用内常规路由
    const finalUrl = resolveUrl(url, options.params);

    return new Promise((resolve) => {
        const onFail = (err: UniFail) => {
            handleFail(err?.errMsg || `无法跳转：${finalUrl}`, options);
            resolve(false);
        };
        const onSuccess = () => resolve(true);

        switch (type) {
            case "redirectTo":
                uni.redirectTo({ url: finalUrl, success: onSuccess, fail: onFail });
                break;
            case "switchTab":
                uni.switchTab({ url: finalUrl, success: onSuccess, fail: onFail });
                break;
            case "reLaunch":
                uni.reLaunch({ url: finalUrl, success: onSuccess, fail: onFail });
                break;
            case "navigateTo":
            default:
                uni.navigateTo({ url: finalUrl, animationType: "none", success: onSuccess, fail: onFail });
                break;
        }
    });
}

/** 保留当前页面，跳转到应用内的某个页面 */
export function navigateTo(url: string, options?: NavigateOptions): Promise<boolean> {
    return navigate("navigateTo", url, options);
}

/** 关闭当前页面，跳转到应用内的某个页面 */
export function redirectTo(url: string, options?: NavigateOptions): Promise<boolean> {
    return navigate("redirectTo", url, options);
}

/** 跳转到 switchTab 页面，并关闭其他所有非 tabBar 页面 */
export function switchTab(url: string, options?: NavigateOptions): Promise<boolean> {
    return navigate("switchTab", url, options);
}

/** 关闭所有页面，打开到应用内的某个页面 */
export function reLaunch(url: string, options?: NavigateOptions): Promise<boolean> {
    return navigate("reLaunch", url, options);
}

/** 关闭当前页面，返回上一页面或多级页面 */
export function navigateBack(delta = 1, options: NavigateOptions = {}): Promise<boolean> {
    return navigate("navigateBack", "", { ...options, delta });
}

/** 打开另一个小程序 */
export function navigateToMiniProgram(appId: string, options?: NavigateOptions): Promise<boolean> {
    return navigate("miniprogram", appId, options);
}
