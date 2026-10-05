/**
 * 检查小程序新版本并引导重启升级
 * @param title 弹窗标题
 * @param content 弹窗提示内容
 */
export function checkAppUpdate(title = "更新提示", content = "新版本已经准备好，是否重启应用？"): void {
    const updateManager = uni.getUpdateManager();
    updateManager.onUpdateReady(() => {
        uni.showModal({
            title,
            content,
            showCancel: false,
            confirmText: "立即重启",
            success: (res) => {
                if (res?.confirm) {
                    updateManager.applyUpdate();
                }
            },
        });
    });
}
