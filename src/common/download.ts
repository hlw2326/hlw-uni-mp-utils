/**
 * 下载网络文件并返回本地临时文件路径
 * @param url 文件网络地址
 * @param header 可选自定义请求头
 * @returns 本地临时文件路径 (tempFilePath)
 */
export function downloadFile(url: string, header?: Record<string, string>): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!url) {
			reject(new Error('下载链接不能为空'))
			return
		}

		uni.downloadFile({
			url,
			header,
			success(res) {
				if (res.statusCode >= 200 && res.statusCode < 300 && res.tempFilePath) {
					resolve(res.tempFilePath)
				} else {
					reject(new Error(`下载文件失败，状态码: ${res.statusCode}`))
				}
			},
			fail(err) {
				reject(new Error(err.errMsg || '下载文件网络异常'))
			}
		})
	})
}
