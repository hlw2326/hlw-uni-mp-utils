/**
 * 资源下载配置选项
 */
export interface DownloadOpt {
    /** 资源网络下载地址 */
    url: string;
    /** 指定的本地临时存储路径 */
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
    /** 下载成功后的本地文件临时路径 */
    path?: string;
    /** HTTP 状态码 */
    code?: number;
    /** 错误或提示信息 */
    msg?: string;
}

/**
 * 引导用户开启系统相册授权设置弹窗
 */
export function auth(): void {
    uni.showModal({
        title: "提示",
        content: "需要授权相册权限",
        confirmText: "去设置",
        success: (res) => {
            if (res.confirm) {
                uni.openSetting();
            }
        },
    });
}

/**
 * 保存本地临时图片文件到系统相册
 * @param filePath 本地临时图片路径
 * @returns 保存是否成功
 */
export function saveImage(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
        uni.saveImageToPhotosAlbum({
            filePath,
            success: () => resolve(true),
            fail: (error) => {
                const errMsg = String(error.errMsg || "");
                if (errMsg.includes("auth deny") || errMsg.includes("authorize")) {
                    auth();
                }
                resolve(false);
            },
        });
    });
}

/**
 * 保存本地临时视频文件到系统相册
 * @param filePath 本地临时视频路径
 * @returns 保存是否成功
 */
export function saveVideoFile(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
        uni.saveVideoToPhotosAlbum({
            filePath,
            success: () => resolve(true),
            fail: (error) => {
                const errMsg = String(error.errMsg || "");
                if (errMsg.includes("auth deny") || errMsg.includes("authorize")) {
                    auth();
                }
                resolve(false);
            },
        });
    });
}

/**
 * 下载网络文件至本地临时目录
 * @param options 下载配置参数
 * @returns 下载结果 Promise
 */
export function download(options: DownloadOpt): Promise<DownloadRes> {
    return new Promise((resolve) => {
        const task = uni.downloadFile({
            url: options.url,
            filePath: options.path,
            header: options.header,
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve({ ok: true, path: res.tempFilePath, code: res.statusCode });
                } else {
                    resolve({ ok: false, code: res.statusCode, msg: `下载失败，状态码：${res.statusCode}` });
                }
            },
            fail: (error) => resolve({ ok: false, msg: error.errMsg }),
        });

        if (options.progress) {
            task.onProgressUpdate((res) => {
                options.progress?.(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite);
            });
        }
    });
}

/**
 * 下载网络图片并直接保存至系统相册
 * @param url 网络图片地址
 * @param progress 下载进度回调
 * @returns 操作是否成功
 */
export async function saveImageUrl(url: string, progress?: (value: number) => void): Promise<boolean> {
    try {
        const res = await download({ url, progress });
        if (!res.ok || !res.path) {
            return false;
        }
        return await saveImage(res.path);
    } catch {
        return false;
    }
}

/**
 * 下载网络视频并直接保存至系统相册
 * @param url 网络视频地址
 * @param progress 下载进度回调
 * @returns 操作是否成功
 */
export async function saveVideoUrl(url: string, progress?: (value: number) => void): Promise<boolean> {
    try {
        const res = await download({ url, progress });
        if (!res.ok || !res.path) {
            return false;
        }
        return await saveVideoFile(res.path);
    } catch {
        return false;
    }
}
