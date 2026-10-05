/**
 * 拼接 URL 与 Query 字符串
 * @param url 基础 URL
 * @param qs 格式化后的 query 字符串
 */
export function withQuery(url: string, qs: string): string {
    if (!qs) {
        return url;
    }
    return `${url}${url.includes("?") ? "&" : "?"}${qs}`;
}

/**
 * 将对象序列化为 URL 编码的 Query 字符串（自动过滤 undefined 与 null）
 * @param data 键值对对象
 */
export function toQuery(data: Record<string, unknown>): string {
    return Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&");
}

/**
 * 递归安全解码 URL 编码字符串，杜绝双重编码导致的乱码
 * @param str 待解码字符串
 */
export function safeDecode(str: string): string {
    if (!str) {
        return "";
    }
    let cur = String(str);
    try {
        while (cur.includes("%")) {
            const next = decodeURIComponent(cur);
            if (next === cur) {
                break;
            }
            cur = next;
        }
    } catch {}
    return cur;
}

/**
 * 校验页面路径是否匹配通配模式（支持逗号分隔多路径及 * 通配）
 * @param pattern 匹配规则（例如 "/pages/index/*, /pages/user/*" 或 "*"）
 * @param currentPath 当前页面路径
 */
export function isPageMatch(pattern: string, currentPath: string): boolean {
    const trimmed = (pattern || "").trim();
    if (!trimmed || trimmed === "*") {
        return true;
    }

    const cleanCurrent = "/" + (currentPath || "").trim().replace(/^\//, "");
    const paths = trimmed
        .split(",")
        .map((p) => "/" + p.trim().replace(/^\//, ""))
        .filter(Boolean);

    return paths.includes(cleanCurrent) || paths.includes("/*") || paths.includes("*");
}

/**
 * 拼装带 Query 参数的 URL 路径
 * @param url 目标路径
 * @param params Query 键值对
 */
export function buildUrl(url: string, params?: Record<string, unknown>): string {
    if (!params) {
        return url;
    }
    const entries = Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "",
    );
    if (!entries.length) {
        return url;
    }
    const query = entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
    return url.includes("?") ? `${url}&${query}` : `${url}?${query}`;
}
