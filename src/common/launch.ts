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
export function parseScene(rawScene: string): Record<string, string> {
    if (!rawScene) {
        return {};
    }
    const decoded = decodeURIComponent(String(rawScene)).trim();
    if (!decoded) {
        return {};
    }

    const result: Record<string, string> = {};

    // 1. 标准 Query 串格式 (包含 = 或 &)
    if (decoded.includes("=") || decoded.includes("&")) {
        const pairs = decoded.split("&");
        for (const pair of pairs) {
            const [k, v] = pair.split("=");
            if (k) {
                result[k.trim()] = v ? v.trim() : "";
            }
        }
        return result;
    }

    // 2. 下划线或冒号格式 (如 uid_1001, id:200)
    const splitMatch = decoded.match(/^([a-zA-Z]+)[_:](.+)$/);
    if (splitMatch) {
        result[splitMatch[1]] = splitMatch[2];
        return result;
    }

    // 3. 纯数字 ID 格式
    if (/^\d+$/.test(decoded)) {
        result.id = decoded;
        result.inviteUid = decoded;
        return result;
    }

    result.scene = decoded;
    return result;
}

/**
 * 获取当前小程序启动参数并自动合并解析后的 scene
 * @param enterOptions 小程序 onLaunch / onShow 参数（未传入时自动读取 getEnterOptionsSync）
 */
export function getLaunchQuery(enterOptions?: Record<string, any>): Record<string, string> {
    const opts = enterOptions || (typeof uni.getEnterOptionsSync === "function" ? uni.getEnterOptionsSync() : {});
    const query = { ...(opts?.query || {}) };
    if (query.scene) {
        const parsed = parseScene(query.scene);
        Object.assign(query, parsed);
    }
    return query;
}
