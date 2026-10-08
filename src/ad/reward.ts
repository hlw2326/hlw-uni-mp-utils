/**
 * 广告播放返回结果
 */
export interface AdRes {
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
export interface RewardOption {
    /** 广告单元 ID */
    unitId: string;
    /** 广告拉起成功回调 */
    onShow?: () => void;
}

// 缓存激励广告实例
const rewardMap = new Map<string, UniApp.RewardedVideoAdContext>();

/**
 * 销毁激励广告实例
 */
export function destroyRewardAd(adId: string): void {
    if (!adId) return;
    try {
        rewardMap.get(adId)?.destroy?.();
    } catch {
        // ignore
    }
    rewardMap.delete(adId);
}

/**
 * 获取或创建激励视频广告实例
 */
function getRewardInstance(unitId: string): UniApp.RewardedVideoAdContext | null {
    let ad = rewardMap.get(unitId);
    if (!ad) {
        try {
            ad = uni.createRewardedVideoAd({ adUnitId: unitId });
            rewardMap.set(unitId, ad);
        } catch {
            return null;
        }
    }
    return ad;
}

/**
 * 唤起激励视频（展示失败时自动 reload 重试）
 */
async function triggerRewardAd(ad: UniApp.RewardedVideoAdContext, onShow?: () => void): Promise<void> {
    try {
        await ad.show();
    } catch {
        await ad.load();
        await ad.show();
    }
    onShow?.();
}

/**
 * 展示激励视频广告
 */
export function showRewardAd(options: string | RewardOption): Promise<AdRes> {
    const unitId = typeof options === "string" ? options : options?.unitId;
    const onShow = typeof options === "object" ? options.onShow : undefined;

    if (!unitId) return Promise.resolve({ success: false, isEnded: false });

    const ad = getRewardInstance(unitId);
    if (!ad) return Promise.resolve({ success: false, isEnded: false });

    return new Promise((resolve) => {
        let finished = false;

        const cleanup = () => {
            ad.offClose(onClose);
            ad.offError(onError);
        };

        const onClose = (res: { isEnded?: boolean }) => {
            if (finished) return;
            finished = true;
            cleanup();
            const isEnded = Boolean(res?.isEnded);
            resolve({ success: isEnded, isEnded });
        };

        const onError = (error: unknown) => {
            if (finished) return;
            finished = true;
            cleanup();
            resolve({ success: false, isEnded: false, error });
        };

        ad.onClose(onClose);
        ad.onError(onError);

        triggerRewardAd(ad, onShow).catch(onError);
    });
}

/**
 * 确认继续观看挽留弹窗
 */
export function confirmRewardAd(): Promise<boolean> {
    return new Promise((resolve) => {
        uni.showModal({
            title: "提示",
            content: "需要看完广告才有奖励哦",
            cancelText: "取消",
            confirmText: "继续观看",
            cancelColor: "#999999",
            confirmColor: "#3b82f6",
            success: (res) => resolve(Boolean(res.confirm)),
            fail: () => resolve(false),
        });
    });
}

/**
 * 完整播放激励流程（包含 Loading、超时保护与退出挽留重试）
 */
export async function playRewardAd(options: { unitId?: string; retryConfirm?: boolean } = {}): Promise<AdRes> {
    const { unitId = "", retryConfirm = true } = options;
    if (!unitId) return { success: false, isEnded: false };

    uni.showLoading({ title: "正在拉起广告", mask: true });
    const timer = setTimeout(() => uni.hideLoading(), 8000);

    try {
        const result = await showRewardAd({
            unitId,
            onShow: () => uni.hideLoading(),
        });
        destroyRewardAd(unitId);

        if (result.success && result.isEnded) {
            return result;
        }

        if (retryConfirm && !result.isEnded && !result.error) {
            const retry = await confirmRewardAd();
            if (retry) {
                return await playRewardAd(options);
            }
        }

        return result;
    } catch (error) {
        destroyRewardAd(unitId);
        return { success: false, isEnded: false, error };
    } finally {
        clearTimeout(timer);
        uni.hideLoading();
    }
}
