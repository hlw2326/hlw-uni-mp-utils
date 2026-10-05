/**
 * 安全转换未知值为数字类型
 * @param value 目标输入值
 * @param defaultValue 转换失败时的默认值
 */
export function toNumber(value: unknown, defaultValue: number): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : defaultValue;
}

/**
 * 安全转换未知值为布尔类型
 * @param value 目标输入值
 * @param defaultValue 转换失败时的默认值
 */
export function toBoolean(value: unknown, defaultValue: boolean): boolean {
    if (typeof value === "boolean") {
        return value;
    }
    if (value === 0 || value === "0" || value === "false") {
        return false;
    }
    if (value === 1 || value === "1" || value === "true") {
        return true;
    }
    return defaultValue;
}

/**
 * 从包含千分位符号的字符串中解析出纯数字
 * @param text 格式化数字字符串
 */
export function getNumber(text: string): number {
    return parseFloat((text || "").replace(/,/g, "")) || 0;
}

/**
 * 格式化大数值展示（如 12345 转换为 1.2w，100000000 转换为 1.0亿）
 * @param value 数值或数值字符串
 */
export function formatConvertNumber(value: number | string): string {
    const num = parseFloat(String(value)) || 0;
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + "亿";
    }
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + "w";
    }
    return String(value);
}

/**
 * 格式化数值展示（无数据或 0 返回空字符串，大数格式化为 w / 亿）
 * @param val 数值或数值字符串
 */
export function formatNum(val: number | string): string {
    const n = Number(val);
    if (!n) {
        return "";
    }
    return formatConvertNumber(n);
}

/** 格式化数值简短别名 */
export const formatNumber = formatConvertNumber;
