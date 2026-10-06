/**
 * 将对象序列化为 URL 查询字符串
 * @param params 参数键值对象
 * @param prefix 是否包含前缀 '?'，默认 false
 */
export function stringifyQuery(params: Record<string, unknown>, prefix = false): string {
	const pairs: string[] = []

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) {
			continue
		}
		const encodedKey = encodeURIComponent(key)
		if (Array.isArray(value)) {
			for (const item of value) {
				if (item !== undefined && item !== null) {
					pairs.push(`${encodedKey}=${encodeURIComponent(String(item))}`)
				}
			}
		} else {
			pairs.push(`${encodedKey}=${encodeURIComponent(String(value))}`)
		}
	}

	const qs = pairs.join('&')
	if (!qs) return ''
	return prefix ? `?${qs}` : qs
}

/**
 * 解析 URL 或查询字符串为对象
 * @param urlOrQuery 完整 URL 或查询字符串（例如 '?id=1&name=test' 或 'https://example.com?a=1'）
 */
export function parseQuery<T extends Record<string, string> = Record<string, string>>(urlOrQuery: string): T {
	const result: Record<string, string> = {}
	if (!urlOrQuery) return result as T

	const qIndex = urlOrQuery.indexOf('?')
	const queryString = qIndex !== -1 ? urlOrQuery.slice(qIndex + 1) : urlOrQuery
	const rawPairs = queryString.split('&')

	for (const pair of rawPairs) {
		if (!pair) continue
		const eqIndex = pair.indexOf('=')
		if (eqIndex === -1) {
			result[decodeURIComponent(pair)] = ''
		} else {
			const key = decodeURIComponent(pair.slice(0, eqIndex))
			const val = decodeURIComponent(pair.slice(eqIndex + 1))
			result[key] = val
		}
	}

	return result as T
}
