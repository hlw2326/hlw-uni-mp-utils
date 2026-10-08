/**
 * 复制文本内容至系统剪贴板
 * @param text 待复制文本
 * @param successMsg 复制成功时的提示文案，留空不提示
 * @returns 是否复制成功
 */
export function copy(text: string, successMsg?: string): Promise<boolean> {
    return new Promise((resolve) => {
        uni.setClipboardData({
            data: text,
            showToast: false,
            success: () => {
                if (successMsg) {
                    uni.showToast({ title: successMsg, icon: "none" });
                }
                resolve(true);
            },
            fail: () => {
                if (successMsg) {
                    uni.showToast({ title: "复制失败", icon: "none" });
                }
                resolve(false);
            },
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
            success: (res) => resolve(res.data || ""),
            fail: () => resolve(""),
        });
    });
}

