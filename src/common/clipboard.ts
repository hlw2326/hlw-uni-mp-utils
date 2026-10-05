/**
 * 复制文本内容至系统剪贴板
 * @param text 待复制文本
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
 * 从系统剪贴板中读取文本内容
 * @returns 剪贴板文本内容
 */
export function paste(): Promise<string> {
    return new Promise((resolve) => {
        uni.getClipboardData({
            success: (res) => resolve(res.data),
            fail: () => resolve(""),
        });
    });
}
