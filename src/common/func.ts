/**
 * 防抖函数：在延迟时间内多次调用，仅执行最后一次
 * @param fn 目标函数
 * @param delay 延迟毫秒数，默认 300
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay = 300
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function (this: unknown, ...args: Parameters<T>): void {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
			timer = null
		}, delay)
	}
}

/**
 * 节流函数：指定时间间隔内只允许执行一次
 * @param fn 目标函数
 * @param interval 间隔毫秒数，默认 300
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	interval = 300
): (...args: Parameters<T>) => void {
	let lastTime = 0

	return function (this: unknown, ...args: Parameters<T>): void {
		const now = Date.now()
		if (now - lastTime >= interval) {
			lastTime = now
			fn.apply(this, args)
		}
	}
}
