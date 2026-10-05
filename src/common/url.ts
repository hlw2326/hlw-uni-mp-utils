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
