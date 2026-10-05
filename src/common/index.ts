/**
 * 资源下载配置项
 */
export interface DownloadOpt {
    /** 资源下载网络地址 */
    url: string;
    /** 指定的本地存储目标路径 */
    path?: string;
    /** 额外的 HTTP 请求头 */
    header?: Record<string, string>;
    /** 下载进度更新回调函数 */
    progress?: (progress: number, written: number, total: number) => void;
}

/**
 * 资源下载返回结果
 */
export interface DownloadRes {
    /** 是否下载成功 */
    ok: boolean;
    /** 下载成功后的本地临时文件路径 */
    path?: string;
    /** HTTP 状态码 */
    code?: number;
    /** 错误或提示信息文本 */
    msg?: string;
}

/**
 * 拼接 URL 与 Query String。
 * @param url 原 URL
 * @param qs 格式化后的 query 字符串
 */
export function withQuery(url: string, qs: string): string {
    if (!qs) return url;
    return `${url}${url.includes("?") ? "&" : "?"}${qs}`;
}

/**
 * 将键值对对象转换为 URL 编码的 Query String。
 * 自动过滤值为 undefined 或 null 的键。
 */
export function toQuery(data: Record<string, unknown>): string {
    return Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&");
}


/**
 * 安全转换未知值到数字类型，若转换失败则返回默认值。
 */
export function toNumber(value: unknown, defaultValue: number): number {
    const next = Number(value);
    return Number.isFinite(next) ? next : defaultValue;
}

/**
 * 安全转换未知值到布尔值类型，若转换失败则返回默认值。
 */
export function toBoolean(value: unknown, defaultValue: boolean): boolean {
    if (typeof value === "boolean") return value;
    if (value === 0 || value === "0" || value === "false") return false;
    if (value === 1 || value === "1" || value === "true") return true;
    return defaultValue;
}

/**
 * 从格式化的字符串中解析出纯数字（去除千分位逗号等）。
 */
export function getNumber(valueString: string): number {
    return parseFloat((valueString || "").replace(/,/g, "")) || 0;
}

/**
 * 格式化大数值，如 12345 转换为 1.2w
 */
export function formatConvertNumber(value: number | string): string {
    const num = parseFloat(String(value)) || 0;
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + "w";
    }
    return String(value);
}

/** 格式化数值简短别名 */
export const formatNumber = formatConvertNumber;

/**
 * 复制文本内容至剪贴板。
 * @param text 需要复制的文本
 * @returns 是否复制成功
 */
export function copy(text: string): Promise<boolean> {
    return new Promise((resolve) => {
        uni.setClipboardData({
            data: text,
            showToast: false,
            success: () => resolve(true),
            fail: () => resolve(false),
        });
    });
}

/**
 * 从系统剪贴板中读取文本内容。
 * @returns 剪贴板文本，若读取失败或无内容返回空字符串
 */
export function paste(): Promise<string> {
    return new Promise((resolve) => {
        uni.getClipboardData({
            success: (res) => resolve(res.data),
            fail: () => resolve(""),
        });
    });
}

/**
 * 引导用户进行系统相册权限授权提示弹窗。
 */
export function auth(): void {
    uni.showModal({
        title: "提示",
        content: "需要授权相册权限",
        confirmText: "去设置",
        success: (res) => {
            if (res.confirm) uni.openSetting();
        },
    });
}

/**
 * 保存本地临时图片文件到系统相册中。
 * @param path 本地临时图片路径
 * @returns 保存是否成功
 */
export function saveImage(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        uni.saveImageToPhotosAlbum({
            filePath: path,
            success: () => resolve(true),
            fail: (error) => {
                const msg = String(error.errMsg || "");
                if (msg.includes("auth deny") || msg.includes("authorize")) {
                    auth();
                }
                resolve(false);
            },
        });
    });
}

/**
 * 保存本地临时视频文件到系统相册中。
 * @param path 本地临时视频路径
 * @returns 保存是否成功
 */
export function saveVideoFile(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        uni.saveVideoToPhotosAlbum({
            filePath: path,
            success: () => resolve(true),
            fail: (error) => {
                const msg = String(error.errMsg || "");
                if (msg.includes("auth deny") || msg.includes("authorize")) {
                    auth();
                }
                resolve(false);
            },
        });
    });
}

/**
 * 基于 UniApp 下载网络资源至本地临时目录中。
 * @param opt 下载参数配置项
 * @returns 下载结果 Promise
 */
export function download(opt: DownloadOpt): Promise<DownloadRes> {
    return new Promise((resolve) => {
        const task = uni.downloadFile({
            url: opt.url,
            filePath: opt.path,
            header: opt.header,
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve({ ok: true, path: res.tempFilePath, code: res.statusCode });
                } else {
                    resolve({ ok: false, code: res.statusCode, msg: `下载失败，状态码：${res.statusCode}` });
                }
            },
            fail: (error) => resolve({ ok: false, msg: error.errMsg }),
        });

        if (opt.progress) {
            task.onProgressUpdate((res) => {
                opt.progress!(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite);
            });
        }
    });
}

/**
 * 下载并保存网络图片至系统相册。
 * @param url 网络图片地址
 * @param progress 可选的下载进度更新回调
 * @returns 操作是否成功
 */
export async function saveImageUrl(url: string, progress?: (value: number) => void): Promise<boolean> {
    try {
        const res = await download({ url, progress });
        if (!res.ok || !res.path) return false;
        return await saveImage(res.path);
    } catch {
        return false;
    }
}

/**
 * 下载并保存网络视频至系统相册。
 * @param url 网络视频地址
 * @param progress 可选的下载进度更新回调
 * @returns 操作是否成功
 */
export async function saveVideoUrl(url: string, progress?: (value: number) => void): Promise<boolean> {
    try {
        const res = await download({ url, progress });
        if (!res.ok || !res.path) return false;
        return await saveVideoFile(res.path);
    } catch {
        return false;
    }
}


/**
 * 检查小程序新版本
 * @param title 提示标题串
 * @param content 提示内容串
 */
export function checkAppUpdate(title = "更新提示", content = "新版本已经准备好，是否重启应用？"): void {
    const updateManager = uni.getUpdateManager();
    updateManager.onUpdateReady(() => {
        uni.showModal({
            title,
            content,
            showCancel: false,
            confirmText: "立即重启",
            success: (res) => {
                if (res?.confirm) {
                    updateManager.applyUpdate();
                }
            },
        });
    });
}
