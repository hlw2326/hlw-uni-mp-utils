/**
 * 跨端安全时间戳转换（兼容 iOS/Safari 不支持连字符 "YYYY-MM-DD" 的系统限制）
 * @param val 时间字符串、时间戳或 Date 实例
 * @returns 毫秒时间戳（无效输入返回 0）
 */
export function parseDate(val: string | number | Date): number {
    if (!val) {
        return 0;
    }
    if (typeof val === "number") {
        return val;
    }
    if (val instanceof Date) {
        return val.getTime();
    }
    return new Date(String(val).replace(/-/g, "/")).getTime() || 0;
}

/**
 * 获取本地当天日期字符串 (默认 YYYY-MM-DD)
 * @param date 目标日期，默认当前时间
 */
export function getTodayStr(date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 检查当前时间是否落在指定的起止生效区间内
 * @param startAt 起始时间
 * @param endAt 结束时间
 * @param now 对比基准时间戳，默认当前时间
 */
export function isTimeInRange(startAt?: string, endAt?: string, now = Date.now()): boolean {
    if (startAt) {
        const startTime = parseDate(startAt);
        if (startTime > 0 && now < startTime) {
            return false;
        }
    }
    if (endAt) {
        const endTime = parseDate(endAt);
        if (endTime > 0 && now > endTime) {
            return false;
        }
    }
    return true;
}

/**
 * 格式化日期时间
 * @param val 时间字符串、时间戳或 Date 实例
 * @param format 格式模版，默认 "YYYY-MM-DD HH:mm:ss"
 */
export function formatDate(val: string | number | Date, format = "YYYY-MM-DD HH:mm:ss"): string {
    const time = parseDate(val);
    if (!time) {
        return "";
    }
    const d = new Date(time);
    const dict: Record<string, string> = {
        "Y+": String(d.getFullYear()),
        "M+": String(d.getMonth() + 1).padStart(2, "0"),
        "D+": String(d.getDate()).padStart(2, "0"),
        "H+": String(d.getHours()).padStart(2, "0"),
        "m+": String(d.getMinutes()).padStart(2, "0"),
        "s+": String(d.getSeconds()).padStart(2, "0"),
    };

    let result = format;
    for (const k in dict) {
        const reg = new RegExp(`(${k})`);
        if (reg.test(result)) {
            result = result.replace(reg, dict[k]);
        }
    }
    return result;
}
