/**
 * 节点边界尺寸信息
 */
export interface RectInfo {
	id: string
	dataset: Record<string, unknown>
	left: number
	right: number
	top: number
	bottom: number
	width: number
	height: number
}

/**
 * 异步查询单个节点尺寸信息
 * @param selector 选择器，例如 '#header' 或 '.content'
 * @param context 自定义组件实例上下文 (可选)
 * @returns 节点尺寸信息 Promise
 */
export function getRect(selector: string, context?: unknown): Promise<RectInfo | null> {
	return new Promise((resolve) => {
		const query = context
			? uni.createSelectorQuery().in(context as Parameters<ReturnType<typeof uni.createSelectorQuery>['in']>[0])
			: uni.createSelectorQuery()

		query
			.select(selector)
			.boundingClientRect((res) => {
				if (res && !Array.isArray(res)) {
					resolve(res as unknown as RectInfo)
				} else {
					resolve(null)
				}
			})
			.exec()
	})
}

/**
 * 异步查询全部匹配节点尺寸信息
 * @param selector 选择器，例如 '.item'
 * @param context 自定义组件实例上下文 (可选)
 * @returns 节点尺寸信息数组 Promise
 */
export function getAllRect(selector: string, context?: unknown): Promise<RectInfo[]> {
	return new Promise((resolve) => {
		const query = context
			? uni.createSelectorQuery().in(context as Parameters<ReturnType<typeof uni.createSelectorQuery>['in']>[0])
			: uni.createSelectorQuery()

		query
			.selectAll(selector)
			.boundingClientRect((res) => {
				if (Array.isArray(res)) {
					resolve(res as unknown as RectInfo[])
				} else {
					resolve([])
				}
			})
			.exec()
	})
}
