/**
 * 触感反馈震动强度类型
 */
export type HapticType = 'light' | 'medium' | 'heavy'

/**
 * 触发轻量触感震动反馈
 * @param type 震动强度：'light' 轻微 (默认) | 'medium' 中等 | 'heavy' 强烈
 * @returns 是否成功触发
 */
export function haptic(type: HapticType = 'light'): Promise<boolean> {
	return new Promise((resolve) => {
		try {
			uni.vibrateShort({
				type,
				success() {
					resolve(true)
				},
				fail() {
					resolve(false)
				}
			})
		} catch {
			resolve(false)
		}
	})
}
