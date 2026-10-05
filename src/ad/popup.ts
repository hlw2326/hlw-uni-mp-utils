// 缓存插屏广告实例
const popupMap = new Map<string, UniApp.InterstitialAdContext>();

/**
 * 初始化或重建当前页面的插屏广告
 */
export function initPopupAd(adId: string): UniApp.InterstitialAdContext | null {
    if (!adId) return null;
    popupMap.get(adId)?.destroy?.();
    try {
        const ad = uni.createInterstitialAd({ adUnitId: adId });
        popupMap.set(adId, ad);
        return ad;
    } catch {
        return null;
    }
}

/**
 * 配置/预载插屏广告
 */
export function setPopupAd(adId: string): boolean {
    return !!(popupMap.get(adId) || initPopupAd(adId));
}

/**
 * 展示插屏广告（支持延时展示，遇跨页失效自动重建重试）
 */
export async function showPopupAd(adId: string, delay = 0): Promise<boolean> {
    if (!adId) return false;
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));

    let ad = popupMap.get(adId) || initPopupAd(adId);
    if (!ad) return false;

    try {
        await ad.show();
        return true;
    } catch {
        // 跨页面或旧实例失效时，重建并重试一次
        ad = initPopupAd(adId);
        return ad ? ad.show().then(() => true).catch(() => false) : false;
    }
}
