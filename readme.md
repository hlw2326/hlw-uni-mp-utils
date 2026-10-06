# @hlw-uni-mp/utils

Universal Uni-App 无状态通用工具函数库。100% 纯粹无状态与零 UI 依赖，涵盖消息提示、原生路由跳转、系统剪贴板与相册、应用更新、参数解析、时间格式化、Canvas 绘制与广告调度。

---

## 核心特性

- **100% 无状态与零 UI 依赖**：纯工具函数与全局单例门面，不引入 Vue 响应式状态或 UI 组件。
- **跨端统一 API**：统一微信小程序、移动端与 H5 差异，极简调用。
- **全 TypeScript 驱动**：完备的类型推导与 JSDoc 注释提示。

---

## 模块列表

| 模块 | 核心方法 / 工具 | 描述 |
| :--- | :--- | :--- |
| **`msg`** | `toast`, `modal`, `showLoading`, `hideLoading`, `hlw.$msg` | 跨端轻提示、模态确认弹窗与加载态门面封装 |
| **`common`** | `copy`, `paste`, `saveImageUrl`, `saveVideoUrl`, `checkAppUpdate`, `getLaunchQuery`, `debounce`, `throttle`, `formatFileSize`, `hlw` | 系统剪贴板、相册保存、应用更新、防抖节流与文件大小格式化 |
| **`navigator`** | `navigate`, `navigateTo`, `redirectTo`, `reLaunch`, `switchTab`, `navigateBack` | 跨端原生路由跳转与参数序列化 |
| **`date`** | `formatDate`, `timeAgo`, `formatDuration` | 日期格式化与相对时间计算 |
| **`canvas`** | `drawRoundRect`, `drawTextWrap`, `drawCircleImage` | 海报与 Canvas 2D 高频绘制工具 |
| **`ad`** | `initPopupAd`, `playRewardAd`, `createBannerAd` | 全局单例激励视频广告与插屏广告调度器 |
| **`device`** | `getDevice`, `DeviceInfo` | 跨端设备硬件参数、系统版本与网络状态统一采集与缓存 |
| **`dom`** | `getRect`, `getAllRect`, `RectInfo` | Promise 风格异步节点尺寸查询与批量测量 |
| **`permission`** | `checkPermission`, `PermissionScope` | 智能权限检查、自动授权申请与引导开启二次确认弹窗 |

---

## 安装

```bash
# pnpm
pnpm add @hlw-uni-mp/utils

# npm
npm install @hlw-uni-mp/utils
```

---

## 快速使用

### 1. 轻提示与弹窗 (`msg`)

```ts
import { toast, modal, showLoading, hideLoading, hlw } from "@hlw-uni-mp/utils";

// 弹出提示
toast("操作成功", "success");

// 确认弹窗
const confirmed = await modal({
    title: "提示",
    content: "确定要执行删除操作吗？",
});

// 加载提示
showLoading("加载中...");
// ...
hideLoading();

// 或通过全局门面调用
hlw.$msg.toast("通过门面调用");
```

---

### 2. 剪贴板与媒体保存 (`common`)

```ts
import { copy, paste, saveImageUrl, saveVideoUrl, checkAppUpdate } from "@hlw-uni-mp/utils";

// 复制文本并自动轻提示
await copy("要复制的内容", "已复制到剪贴板");

// 保存图片到相册（自动申请权限）
await saveImageUrl("https://example.com/poster.jpg");

// 检查小程序版本更新
checkAppUpdate();
```

---

### 3. 原生路由跳转 (`navigator`)

```ts
import { navigate, navigateBack } from "@hlw-uni-mp/utils";

// 智能跳转（自动识别 Tab 页面与普通页面）
navigate("/pages/detail/index?id=100");

// 指定模式跳转
navigate("/pages/user/index", "switchTab");

// 返回上一页
navigateBack();
```

---

### 4. 激励广告调度 (`ad`)

```ts
import { playRewardAd } from "@hlw-uni-mp/utils";

// 播放激励视频广告并获取播放结果
const completed = await playRewardAd("adunit-xxxxxx");
if (completed) {
    console.log("发放奖励");
}
```

---

## License

MIT
