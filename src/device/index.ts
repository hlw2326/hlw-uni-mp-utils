/**
 * 设备信息定义
 */
export interface DeviceInfo {
	appid: string
	appName: string
	version: string
	versionCode: string
	channel: string
	deviceId: string
	deviceType: string
	deviceOrientation: 'portrait' | 'landscape'
	brand: string
	model: string
	system: string
	os: string
	pixelRatio: number
	screenWidth: number
	screenHeight: number
	windowWidth: number
	windowHeight: number
	statusBarHeight: number
	sdkVersion: string
	hostName: string
	hostVersion: string
	hostLanguage: string
	hostTheme: string
	platform: string
	language: string
	networkType: string
	benchmarkLevel: number
	theme: string
	fontSizeSetting: number
}

declare global {
	namespace UniNamespace {
		interface GetDeviceInfoResult {
			benchmarkLevel?: number
		}
		interface GetAppBaseInfoResult {
			appChannel?: string
			appLanguage?: string
			fontSizeSetting?: number
		}
		interface GetWindowInfoResult {
			deviceOrientation?: 'portrait' | 'landscape'
		}
	}
}

let deviceCache: DeviceInfo | null = null
let currentNetworkType = ''

// 异步监听网络状态保持最新
uni.getNetworkType({
	success(res) {
		currentNetworkType = res.networkType || ''
		if (deviceCache) {
			deviceCache.networkType = currentNetworkType
		}
	}
})
uni.onNetworkStatusChange((res) => {
	currentNetworkType = res.networkType || ''
	if (deviceCache) {
		deviceCache.networkType = currentNetworkType
	}
})

/**
 * 采集设备信息
 * @returns 设备参数集
 */
export function getDevice(): DeviceInfo {
	if (deviceCache) return deviceCache
	const deviceRaw = uni.getDeviceInfo()
	const windowRaw = uni.getWindowInfo()
	const appRaw = uni.getAppBaseInfo()
	const accountRaw = uni.getAccountInfoSync()
	const system = deviceRaw.system || ''

	deviceCache = {
		appid: accountRaw.miniProgram?.appId || '',
		appName: appRaw.appName || '',
		version: appRaw.appVersion || '',
		versionCode: appRaw.appVersionCode || '',
		channel: appRaw.appChannel || '',
		deviceId: deviceRaw.deviceId || '',
		deviceType: deviceRaw.deviceType || '',
		deviceOrientation: deviceRaw.deviceOrientation || windowRaw.deviceOrientation || 'portrait',
		brand: deviceRaw.brand || '',
		model: deviceRaw.model || '',
		system,
		os: system.split(' ')[0] || '',
		pixelRatio: windowRaw.pixelRatio || 0,
		screenWidth: windowRaw.screenWidth || 0,
		screenHeight: windowRaw.screenHeight || 0,
		windowWidth: windowRaw.windowWidth || 0,
		windowHeight: windowRaw.windowHeight || 0,
		statusBarHeight: windowRaw.statusBarHeight || 0,
		sdkVersion: appRaw.SDKVersion || '',
		hostName: appRaw.hostName || '',
		hostVersion: appRaw.hostVersion || '',
		hostLanguage: appRaw.hostLanguage || '',
		hostTheme: appRaw.hostTheme || '',
		platform: deviceRaw.platform || '',
		language: appRaw.appLanguage || '',
		networkType: currentNetworkType,
		benchmarkLevel: deviceRaw.benchmarkLevel || 0,
		theme: appRaw.theme || 'light',
		fontSizeSetting: appRaw.fontSizeSetting || 16
	}

	return deviceCache
}
