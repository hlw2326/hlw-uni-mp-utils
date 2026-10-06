/**
 * 权限 Scope 类型定义
 */
export type PermissionScope =
	| 'scope.userLocation'
	| 'scope.userLocationBackground'
	| 'scope.record'
	| 'scope.camera'
	| 'scope.bluetooth'
	| 'scope.writePhotosAlbum'
	| 'scope.addPhoneContact'
	| 'scope.addPhoneCalendar'
	| 'scope.werun'
	| 'scope.address'
	| 'scope.invoiceTitle'
	| 'scope.invoice'
	| 'scope.userInfo'

/**
 * 权限引导弹窗配置
 */
export interface PermissionOptions {
	/** 弹窗标题，默认“授权提示” */
	title?: string
	/** 弹窗说明内容，例如“需要访问相册以保存海报” */
	content?: string
	/** 确认按钮文字，默认“去设置” */
	confirmText?: string
	/** 取消按钮文字，默认“取消” */
	cancelText?: string
}

const DEFAULT_SCOPE_NAMES: Record<string, string> = {
	'scope.writePhotosAlbum': '相册保存',
	'scope.camera': '相机拍摄',
	'scope.record': '麦克风录音',
	'scope.userLocation': '地理位置',
	'scope.bluetooth': '蓝牙设备',
	'scope.addPhoneContact': '通讯录'
}

/**
 * 检查并申请权限（若已拒绝则弹窗引导去设置页开启）
 * @param scope 申请的权限 scope 标识
 * @param options 引导弹窗提示配置
 * @returns 是否获得授权
 */
export function checkPermission(scope: PermissionScope, options: PermissionOptions = {}): Promise<boolean> {
	return new Promise((resolve) => {
		// #ifndef MP-WEIXIN
		// 非微信小程序环境默认放行
		resolve(true);
		return;
		// #endif

		// #ifdef MP-WEIXIN
		uni.getSetting({
			success(res) {
				const auth = res.authSetting as unknown as Record<string, boolean | undefined>;
				// 1. 已获得授权
				if (auth && auth[scope] === true) {
					resolve(true);
					return;
				}

				// 2. 未曾询问过授权（首次申请），调用 uni.authorize
				if (!auth || auth[scope] === undefined) {
					uni.authorize({
						scope,
						success() {
							resolve(true);
						},
						fail() {
							// 首次被拒绝，不强弹二次引导，交由用户下一步触发
							resolve(false);
						}
					});
					return;
				}

				// 3. 曾被明确拒绝，弹窗引导用户跳转到设置页
				const scopeName = DEFAULT_SCOPE_NAMES[scope] || '相关';
				const title = options.title || '授权提示';
				const content = options.content || `需要使用${scopeName}功能，请在设置中开启权限`;
				const confirmText = options.confirmText || '去设置';
				const cancelText = options.cancelText || '取消';

				uni.showModal({
					title,
					content,
					confirmText,
					cancelText,
					success(modalRes) {
						if (modalRes.confirm) {
							uni.openSetting({
								success(settingRes) {
									const authSetting = settingRes.authSetting as unknown as Record<string, boolean | undefined>;
									const granted = Boolean(authSetting && authSetting[scope] === true);
									resolve(granted);
								},
								fail() {
									resolve(false);
								}
							});
						} else {
							resolve(false);
						}
					},
					fail() {
						resolve(false);
					}
				});
			},
			fail() {
				resolve(false);
			}
		});
		// #endif
	})
}
