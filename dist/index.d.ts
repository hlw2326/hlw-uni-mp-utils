/**
 * 拼接 URL 与 Query 字符串
 * @param url 基础 URL
 * @param qs 格式化后的 query 字符串
 */
declare function withQuery(url: string, qs: string): string;
/**
 * 将对象序列化为 URL 编码的 Query 字符串（自动过滤 undefined 与 null）
 * @param data 键值对对象
 */
declare function toQuery(data: Record<string, unknown>): string;
/**
 * 递归安全解码 URL 编码字符串，杜绝双重编码导致的乱码
 * @param str 待解码字符串
 */
declare function safeDecode(str: string): string;
/**
 * 校验页面路径是否匹配通配模式（支持逗号分隔多路径及 * 通配）
 * @param pattern 匹配规则（例如 "/pages/index/*, /pages/user/*" 或 "*"）
 * @param currentPath 当前页面路径
 */
declare function isPageMatch(pattern: string, currentPath: string): boolean;
/**
 * 拼装带 Query 参数的 URL 路径
 * @param url 目标路径
 * @param params Query 键值对
 */
declare function buildUrl(url: string, params?: Record<string, unknown>): string;

/**
 * 安全转换未知值为数字类型
 * @param value 目标输入值
 * @param defaultValue 转换失败时的默认值
 */
declare function toNumber(value: unknown, defaultValue: number): number;
/**
 * 安全转换未知值为布尔类型
 * @param value 目标输入值
 * @param defaultValue 转换失败时的默认值
 */
declare function toBoolean(value: unknown, defaultValue: boolean): boolean;
/**
 * 从包含千分位符号的字符串中解析出纯数字
 * @param text 格式化数字字符串
 */
declare function getNumber(text: string): number;
/**
 * 格式化大数值展示（如 12345 转换为 1.2w，100000000 转换为 1.0亿）
 * @param value 数值或数值字符串
 */
declare function formatConvertNumber(value: number | string): string;
/**
 * 格式化数值展示（无数据或 0 返回空字符串，大数格式化为 w / 亿）
 * @param val 数值或数值字符串
 */
declare function formatNum(val: number | string): string;
/** 格式化数值简短别名 */
declare const formatNumber: typeof formatConvertNumber;
/**
 * 格式化文件字节大小展示（如 1024 转换为 1 KB，1048576 转换为 1 MB）
 * @param bytes 字节数
 * @param decimals 保留小数位数，默认 2
 */
declare function formatFileSize(bytes: number, decimals?: number): string;

/**
 * 复制文本内容至系统剪贴板
 * @param text 待复制文本
 * @param successMsg 复制成功时的提示文案，留空不提示
 * @returns 是否复制成功
 */
declare function copy(text: string, successMsg?: string): Promise<boolean>;
/**
 * 从系统剪贴板中读取文本内容
 * @returns 剪贴板文本内容
 */
declare function paste(): Promise<string>;
/** 写入剪贴板别名 */
declare const setClipboardText: typeof copy;
/** 读取剪贴板别名 */
declare const getClipboardText: typeof paste;

/**
 * 资源下载配置选项
 */
interface DownloadOpt {
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
interface DownloadRes {
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
declare function auth(): void;
/**
 * 将 Base64 图片数据转换为本地临时文件路径
 * @param base64 Base64 图片字符串 (例如 data:image/png;base64,xxx 或纯 base64)
 * @returns 本地临时文件路径 (失败返回空字符串)
 */
declare function base64ToPath(base64: string): Promise<string>;
/**
 * 保存图片到系统相册（全能支持：本地临时文件路径、网络图片 URL、Base64 数据）
 * @param src 本地文件路径、网络地址或 Base64 字符串
 * @returns 保存是否成功
 */
declare function saveImage(src: string): Promise<boolean>;
/**
 * 保存本地临时视频文件到系统相册
 * @param filePath 本地临时视频路径
 * @returns 保存是否成功
 */
declare function saveVideoFile(filePath: string): Promise<boolean>;
/**
 * 下载网络文件至本地临时目录
 * @param options 下载配置参数
 * @returns 下载结果 Promise
 */
declare function download(options: DownloadOpt): Promise<DownloadRes>;
/**
 * 下载网络图片并直接保存至系统相册
 * @param url 网络图片地址
 * @param progress 下载进度回调
 * @returns 操作是否成功
 */
declare function saveImageUrl(url: string, progress?: (value: number) => void): Promise<boolean>;
/**
 * 下载网络视频并直接保存至系统相册
 * @param url 网络视频地址
 * @param progress 下载进度回调
 * @returns 操作是否成功
 */
declare function saveVideoUrl(url: string, progress?: (value: number) => void): Promise<boolean>;

/**
 * 检查小程序新版本并引导重启升级
 * @param title 弹窗标题
 * @param content 弹窗提示内容
 */
declare function checkAppUpdate(title?: string, content?: string): void;

/**
 * 解析微信小程序二维码 scene 场景值参数
 * 支持常见的键值格式：
 * - 单纯数值/ID: "1001" -> { id: "1001", inviteUid: "1001" }
 * - 下划线连接: "uid_1001" -> { uid: "1001" }
 * - 冒号连接: "uid:1001" -> { uid: "1001" }
 * - 标准 Query 串: "uid=1001&channel=dy" -> { uid: "1001", channel: "dy" }
 *
 * @param rawScene 原始 scene 字符串
 */
declare function parseScene(rawScene: string): Record<string, string>;
/**
 * 获取当前小程序启动参数并自动合并解析后的 scene
 * @param enterOptions 小程序 onLaunch / onShow 参数（未传入时自动读取 getEnterOptionsSync）
 */
declare function getLaunchQuery(enterOptions?: App.LaunchShowOption | Record<string, any> | null): Record<string, string>;

/**
 * 防抖函数：在延迟时间内多次调用，仅执行最后一次
 * @param fn 目标函数
 * @param delay 延迟毫秒数，默认 300
 */
declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay?: number): (...args: Parameters<T>) => void;
/**
 * 节流函数：指定时间间隔内只允许执行一次
 * @param fn 目标函数
 * @param interval 间隔毫秒数，默认 300
 */
declare function throttle<T extends (...args: unknown[]) => unknown>(fn: T, interval?: number): (...args: Parameters<T>) => void;
/**
 * 异步延时等待
 * @param ms 延时毫秒数，默认 300
 */
declare function sleep(ms?: number): Promise<void>;

/**
 * 触感反馈震动强度类型
 */
type HapticType = 'light' | 'medium' | 'heavy';
/**
 * 触发轻量触感震动反馈
 * @param type 震动强度：'light' 轻微 (默认) | 'medium' 中等 | 'heavy' 强烈
 * @returns 是否成功触发
 */
declare function haptic(type?: HapticType): Promise<boolean>;

/**
 * 将对象序列化为 URL 查询字符串
 * @param params 参数键值对象
 * @param prefix 是否包含前缀 '?'，默认 false
 */
declare function stringifyQuery(params: Record<string, unknown>, prefix?: boolean): string;
/**
 * 解析 URL 或查询字符串为对象
 * @param urlOrQuery 完整 URL 或查询字符串（例如 '?id=1&name=test' 或 'https://example.com?a=1'）
 */
declare function parseQuery<T extends Record<string, string> = Record<string, string>>(urlOrQuery: string): T;

/**
 * 下载网络文件并返回本地临时文件路径
 * @param url 文件网络地址
 * @param header 可选自定义请求头
 * @returns 本地临时文件路径 (tempFilePath)
 */
declare function downloadFile(url: string, header?: Record<string, string>): Promise<string>;

/**
 * 跨端安全时间戳转换（兼容 iOS/Safari 不支持连字符 "YYYY-MM-DD" 的系统限制）
 * @param val 时间字符串、时间戳或 Date 实例
 * @returns 毫秒时间戳（无效输入返回 0）
 */
declare function parseDate(val: string | number | Date): number;
/**
 * 获取本地当天日期字符串 (默认 YYYY-MM-DD)
 * @param date 目标日期，默认当前时间
 */
declare function getTodayStr(date?: Date): string;
/**
 * 检查当前时间是否落在指定的起止生效区间内
 * @param startAt 起始时间
 * @param endAt 结束时间
 * @param now 对比基准时间戳，默认当前时间
 */
declare function isTimeInRange(startAt?: string, endAt?: string, now?: number): boolean;
/**
 * 格式化日期时间
 * @param val 时间字符串、时间戳或 Date 实例
 * @param format 格式模版，默认 "YYYY-MM-DD HH:mm:ss"
 */
declare function formatDate(val: string | number | Date, format?: string): string;

/**
 * 绘制圆角矩形路径
 */
declare function drawRoundRect(ctx: any, x: number, y: number, w: number, h: number, r: number): void;
/**
 * 异步下载并绘制图片（自动支持网络图片与本地静态图片）
 */
declare function drawImage(canvas: any, ctx: any, src: string, x: number, y: number, w: number, h: number): Promise<void>;
/**
 * 绘制带圆角的图片
 */
declare function drawRoundRectImage(canvas: any, ctx: any, src: string, x: number, y: number, w: number, h: number, r: number): Promise<void>;
/**
 * 绘制圆形头像（支持网络头像与本地默认头像，自动填充圆形浅灰底色）
 */
declare function drawCircleAvatar(canvas: any, ctx: any, src: string, cx: number, cy: number, r: number, strokeColor?: string): Promise<void>;
/**
 * 绘制带字间距的文本 (默认垂直居中对齐 textBaseline = 'middle')
 */
declare function drawTextWithSpacing(ctx: any, text: string, x: number, y: number, spacing?: number, align?: "left" | "center" | "right", baseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom"): void;
/**
 * 测量带字间距文本总宽度
 */
declare function measureTextWithSpacing(ctx: any, text: string, spacing?: number): number;

/**
 * 路由跳转动作类型
 */
type NavigateType = "navigateTo" | "redirectTo" | "switchTab" | "reLaunch" | "navigateBack" | "miniprogram" | (string & {});
/**
 * 路由配置项
 */
interface NavigateOptions {
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
/**
 * 页面路由统一分发
 *
 * @param type 跳转动作类型（默认 navigateTo）
 * @param url 跳转目标路径或目标小程序 AppId
 * @param options 额外的控制与传参选项
 * @returns 是否跳转成功
 */
declare function navigate(type?: NavigateType, url?: string, options?: NavigateOptions): Promise<boolean>;
/** 保留当前页面，跳转到应用内的某个页面 */
declare function navigateTo(url: string, options?: NavigateOptions): Promise<boolean>;
/** 关闭当前页面，跳转到应用内的某个页面 */
declare function redirectTo(url: string, options?: NavigateOptions): Promise<boolean>;
/** 跳转到 switchTab 页面，并关闭其他所有非 tabBar 页面 */
declare function switchTab(url: string, options?: NavigateOptions): Promise<boolean>;
/** 关闭所有页面，打开到应用内的某个页面 */
declare function reLaunch(url: string, options?: NavigateOptions): Promise<boolean>;
/** 关闭当前页面，返回上一页面或多级页面 */
declare function navigateBack(delta?: number, options?: NavigateOptions): Promise<boolean>;
/** 打开另一个小程序 */
declare function navigateToMiniProgram(appId: string, options?: NavigateOptions): Promise<boolean>;

/**
 * 初始化或重建当前页面的插屏广告
 */
declare function initPopupAd(adId: string): UniApp.InterstitialAdContext | null;
/**
 * 配置/预载插屏广告
 */
declare function setPopupAd(adId: string): boolean;
/**
 * 展示插屏广告（支持延时展示，遇跨页失效自动重建重试）
 */
declare function showPopupAd(adId: string, delay?: number): Promise<boolean>;

/**
 * 广告播放返回结果
 */
interface AdRes {
    /** 是否播放成功且满足奖励条件 */
    success: boolean;
    /** 视频是否已完整播放结束 */
    isEnded: boolean;
    /** 异常错误对象 */
    error?: unknown;
}
/**
 * 激励视频参数配置
 */
interface RewardOptions {
    /** 广告单元 ID */
    unitId: string;
    /** 广告拉起成功回调 */
    onShow?: () => void;
}
/**
 * 销毁激励广告实例
 */
declare function destroyRewardAd(adId: string): void;
/**
 * 展示激励视频广告
 */
declare function showRewardAd(options: string | RewardOptions): Promise<AdRes>;
/**
 * 确认继续观看挽留弹窗
 */
declare function confirmRewardAd(): Promise<boolean>;
/**
 * 完整播放激励流程（包含 Loading、超时保护与退出挽留重试）
 */
declare function playRewardAd(options?: {
    unitId?: string;
    retryConfirm?: boolean;
}): Promise<AdRes>;

/**
 * 具有消息提示属性的响应体对象
 */
interface ToastRes {
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
type ToastCallback = (confirm: boolean) => void;
/**
 * 统一消息提示工具接口
 */
interface HlwMsg {
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
declare function toast(opts: UniApp.ShowToastOptions | ToastRes | string, callback?: ToastCallback): Promise<boolean>;
/**
 * 显示成功提示
 */
declare function success(msg: string): void;
/**
 * 显示失败提示
 */
declare function error(msg: string): void;
/**
 * 显示全局加载中遮罩
 */
declare function showLoading(msg?: string): void;
/**
 * 隐藏全局加载中遮罩
 */
declare function hideLoading(): void;
/**
 * 弹出模态确认窗
 */
declare function modal(opts?: UniApp.ShowModalOptions): Promise<boolean>;
/**
 * 消息提示工具单例
 */
declare const msg: HlwMsg;
/**
 * 统一提示 Hook 别名
 */
declare const useMsg: () => HlwMsg;
/**
 * 全局统一挂载门面对象
 */
declare const hlw: {
    $msg: HlwMsg;
};
type HlwInstance = typeof hlw;

/**
 * 设备信息定义
 */
interface DeviceInfo {
    appid: string;
    appName: string;
    version: string;
    versionCode: string;
    channel: string;
    deviceId: string;
    deviceType: string;
    deviceOrientation: 'portrait' | 'landscape';
    brand: string;
    model: string;
    system: string;
    os: string;
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    statusBarHeight: number;
    sdkVersion: string;
    hostName: string;
    hostVersion: string;
    hostLanguage: string;
    hostTheme: string;
    platform: string;
    language: string;
    networkType: string;
    benchmarkLevel: number;
    theme: string;
    fontSizeSetting: number;
}
declare global {
    namespace UniNamespace {
        interface GetDeviceInfoResult {
            benchmarkLevel?: number;
        }
        interface GetAppBaseInfoResult {
            appChannel?: string;
            appLanguage?: string;
            fontSizeSetting?: number;
        }
        interface GetWindowInfoResult {
            deviceOrientation?: 'portrait' | 'landscape';
        }
    }
}
/**
 * 采集设备信息
 * @returns 设备参数集
 */
declare function getDevice(): DeviceInfo;

/**
 * 节点边界尺寸信息
 */
interface RectInfo {
    id: string;
    dataset: Record<string, unknown>;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}
/**
 * 异步查询单个节点尺寸信息
 * @param selector 选择器，例如 '#header' 或 '.content'
 * @param context 自定义组件实例上下文 (可选)
 * @returns 节点尺寸信息 Promise
 */
declare function getRect(selector: string, context?: unknown): Promise<RectInfo | null>;
/**
 * 异步查询全部匹配节点尺寸信息
 * @param selector 选择器，例如 '.item'
 * @param context 自定义组件实例上下文 (可选)
 * @returns 节点尺寸信息数组 Promise
 */
declare function getAllRect(selector: string, context?: unknown): Promise<RectInfo[]>;

/**
 * 权限 Scope 类型定义
 */
type PermissionScope = 'scope.userLocation' | 'scope.userLocationBackground' | 'scope.record' | 'scope.camera' | 'scope.bluetooth' | 'scope.writePhotosAlbum' | 'scope.addPhoneContact' | 'scope.addPhoneCalendar' | 'scope.werun' | 'scope.address' | 'scope.invoiceTitle' | 'scope.invoice' | 'scope.userInfo';
/**
 * 权限引导弹窗配置
 */
interface PermissionOptions {
    /** 弹窗标题，默认“授权提示” */
    title?: string;
    /** 弹窗说明内容，例如“需要访问相册以保存海报” */
    content?: string;
    /** 确认按钮文字，默认“去设置” */
    confirmText?: string;
    /** 取消按钮文字，默认“取消” */
    cancelText?: string;
}
/**
 * 检查并申请权限（若已拒绝则弹窗引导去设置页开启）
 * @param scope 申请的权限 scope 标识
 * @param options 引导弹窗提示配置
 * @returns 是否获得授权
 */
declare function checkPermission(scope: PermissionScope, options?: PermissionOptions): Promise<boolean>;

export { type AdRes, type DeviceInfo, type DownloadOpt, type DownloadRes, type HapticType, type HlwInstance, type HlwMsg, type NavigateOptions, type NavigateType, type PermissionOptions, type PermissionScope, type RectInfo, type RewardOptions, type ToastCallback, type ToastRes, auth, base64ToPath, buildUrl, checkAppUpdate, checkPermission, confirmRewardAd, copy, debounce, destroyRewardAd, download, downloadFile, drawCircleAvatar, drawImage, drawRoundRect, drawRoundRectImage, drawTextWithSpacing, error, formatConvertNumber, formatDate, formatFileSize, formatNum, formatNumber, getAllRect, getClipboardText, getDevice, getLaunchQuery, getNumber, getRect, getTodayStr, haptic, hideLoading, hlw, initPopupAd, isPageMatch, isTimeInRange, measureTextWithSpacing, modal, msg, navigate, navigateBack, navigateTo, navigateToMiniProgram, parseDate, parseQuery, parseScene, paste, playRewardAd, reLaunch, redirectTo, safeDecode, saveImage, saveImageUrl, saveVideoFile, saveVideoUrl, setClipboardText, setPopupAd, showLoading, showPopupAd, showRewardAd, sleep, stringifyQuery, success, switchTab, throttle, toBoolean, toNumber, toQuery, toast, useMsg, withQuery };
