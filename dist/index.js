"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  auth: () => auth,
  buildUrl: () => buildUrl,
  checkAppUpdate: () => checkAppUpdate,
  checkPermission: () => checkPermission,
  confirmRewardAd: () => confirmRewardAd,
  copy: () => copy,
  debounce: () => debounce,
  destroyRewardAd: () => destroyRewardAd,
  download: () => download,
  drawCircleAvatar: () => drawCircleAvatar,
  drawImage: () => drawImage,
  drawRoundRect: () => drawRoundRect,
  drawRoundRectImage: () => drawRoundRectImage,
  drawTextWithSpacing: () => drawTextWithSpacing,
  error: () => error,
  formatConvertNumber: () => formatConvertNumber,
  formatDate: () => formatDate,
  formatFileSize: () => formatFileSize,
  formatNum: () => formatNum,
  formatNumber: () => formatNumber,
  getAllRect: () => getAllRect,
  getClipboardText: () => getClipboardText,
  getDevice: () => getDevice,
  getLaunchQuery: () => getLaunchQuery,
  getNumber: () => getNumber,
  getRect: () => getRect,
  getTodayStr: () => getTodayStr,
  hideLoading: () => hideLoading,
  hlw: () => hlw,
  initPopupAd: () => initPopupAd,
  isPageMatch: () => isPageMatch,
  isTimeInRange: () => isTimeInRange,
  measureTextWithSpacing: () => measureTextWithSpacing,
  modal: () => modal,
  msg: () => msg,
  navigate: () => navigate,
  navigateBack: () => navigateBack,
  navigateTo: () => navigateTo,
  navigateToMiniProgram: () => navigateToMiniProgram,
  parseDate: () => parseDate,
  parseScene: () => parseScene,
  paste: () => paste,
  playRewardAd: () => playRewardAd,
  reLaunch: () => reLaunch,
  redirectTo: () => redirectTo,
  safeDecode: () => safeDecode,
  saveImage: () => saveImage,
  saveImageUrl: () => saveImageUrl,
  saveVideoFile: () => saveVideoFile,
  saveVideoUrl: () => saveVideoUrl,
  setClipboardText: () => setClipboardText,
  setPopupAd: () => setPopupAd,
  showLoading: () => showLoading,
  showPopupAd: () => showPopupAd,
  showRewardAd: () => showRewardAd,
  success: () => success,
  switchTab: () => switchTab,
  throttle: () => throttle,
  toBoolean: () => toBoolean,
  toNumber: () => toNumber,
  toQuery: () => toQuery,
  toast: () => toast,
  useMsg: () => useMsg,
  withQuery: () => withQuery
});
module.exports = __toCommonJS(index_exports);

// src/common/url.ts
function withQuery(url, qs) {
  if (!qs) {
    return url;
  }
  return `${url}${url.includes("?") ? "&" : "?"}${qs}`;
}
function toQuery(data) {
  return Object.entries(data).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&");
}
function safeDecode(str) {
  if (!str) {
    return "";
  }
  let cur = String(str);
  try {
    while (cur.includes("%")) {
      const next = decodeURIComponent(cur);
      if (next === cur) {
        break;
      }
      cur = next;
    }
  } catch {
  }
  return cur;
}
function isPageMatch(pattern, currentPath) {
  const trimmed = (pattern || "").trim();
  if (!trimmed || trimmed === "*") {
    return true;
  }
  const cleanCurrent = "/" + (currentPath || "").trim().replace(/^\//, "");
  const paths = trimmed.split(",").map((p) => "/" + p.trim().replace(/^\//, "")).filter(Boolean);
  return paths.includes(cleanCurrent) || paths.includes("/*") || paths.includes("*");
}
function buildUrl(url, params) {
  if (!params) {
    return url;
  }
  const entries = Object.entries(params).filter(
    ([_, v]) => v !== void 0 && v !== null && v !== ""
  );
  if (!entries.length) {
    return url;
  }
  const query = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
  return url.includes("?") ? `${url}&${query}` : `${url}?${query}`;
}

// src/common/convert.ts
function toNumber(value, defaultValue) {
  const num = Number(value);
  return Number.isFinite(num) ? num : defaultValue;
}
function toBoolean(value, defaultValue) {
  if (typeof value === "boolean") {
    return value;
  }
  if (value === 0 || value === "0" || value === "false") {
    return false;
  }
  if (value === 1 || value === "1" || value === "true") {
    return true;
  }
  return defaultValue;
}
function getNumber(text) {
  return parseFloat((text || "").replace(/,/g, "")) || 0;
}
function formatConvertNumber(value) {
  const num = parseFloat(String(value)) || 0;
  if (num >= 1e8) {
    return (num / 1e8).toFixed(1) + "\u4EBF";
  }
  if (num >= 1e4) {
    return (num / 1e4).toFixed(1) + "w";
  }
  return String(value);
}
function formatNum(val) {
  const n = Number(val);
  if (!n) {
    return "";
  }
  return formatConvertNumber(n);
}
var formatNumber = formatConvertNumber;
function formatFileSize(bytes, decimals = 2) {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

// src/common/clipboard.ts
function copy(text, successMsg) {
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
          uni.showToast({ title: "\u590D\u5236\u5931\u8D25", icon: "none" });
        }
        resolve(false);
      }
    });
  });
}
function paste() {
  return new Promise((resolve) => {
    uni.getClipboardData({
      success: (res) => resolve(res.data || ""),
      fail: () => resolve("")
    });
  });
}
var setClipboardText = copy;
var getClipboardText = paste;

// src/common/media.ts
function auth() {
  uni.showModal({
    title: "\u63D0\u793A",
    content: "\u9700\u8981\u6388\u6743\u76F8\u518C\u6743\u9650",
    confirmText: "\u53BB\u8BBE\u7F6E",
    success: (res) => {
      if (res.confirm) {
        uni.openSetting();
      }
    }
  });
}
function saveImage(filePath) {
  return new Promise((resolve) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => resolve(true),
      fail: (error2) => {
        const errMsg = String(error2.errMsg || "");
        if (errMsg.includes("auth deny") || errMsg.includes("authorize")) {
          auth();
        }
        resolve(false);
      }
    });
  });
}
function saveVideoFile(filePath) {
  return new Promise((resolve) => {
    uni.saveVideoToPhotosAlbum({
      filePath,
      success: () => resolve(true),
      fail: (error2) => {
        const errMsg = String(error2.errMsg || "");
        if (errMsg.includes("auth deny") || errMsg.includes("authorize")) {
          auth();
        }
        resolve(false);
      }
    });
  });
}
function download(options) {
  return new Promise((resolve) => {
    const task = uni.downloadFile({
      url: options.url,
      filePath: options.path,
      header: options.header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve({ ok: true, path: res.tempFilePath, code: res.statusCode });
        } else {
          resolve({ ok: false, code: res.statusCode, msg: `\u4E0B\u8F7D\u5931\u8D25\uFF0C\u72B6\u6001\u7801\uFF1A${res.statusCode}` });
        }
      },
      fail: (error2) => resolve({ ok: false, msg: error2.errMsg })
    });
    if (options.progress) {
      task.onProgressUpdate((res) => {
        options.progress?.(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite);
      });
    }
  });
}
async function saveImageUrl(url, progress) {
  try {
    const res = await download({ url, progress });
    if (!res.ok || !res.path) {
      return false;
    }
    return await saveImage(res.path);
  } catch {
    return false;
  }
}
async function saveVideoUrl(url, progress) {
  try {
    const res = await download({ url, progress });
    if (!res.ok || !res.path) {
      return false;
    }
    return await saveVideoFile(res.path);
  } catch {
    return false;
  }
}

// src/common/update.ts
function checkAppUpdate(title = "\u66F4\u65B0\u63D0\u793A", content = "\u65B0\u7248\u672C\u5DF2\u7ECF\u51C6\u5907\u597D\uFF0C\u662F\u5426\u91CD\u542F\u5E94\u7528\uFF1F") {
  const updateManager = uni.getUpdateManager();
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title,
      content,
      showCancel: false,
      confirmText: "\u7ACB\u5373\u91CD\u542F",
      success: (res) => {
        if (res?.confirm) {
          updateManager.applyUpdate();
        }
      }
    });
  });
}

// src/common/launch.ts
function parseScene(rawScene) {
  if (!rawScene) {
    return {};
  }
  const decoded = decodeURIComponent(String(rawScene)).trim();
  if (!decoded) {
    return {};
  }
  const result = {};
  if (decoded.includes("=") || decoded.includes("&")) {
    const pairs = decoded.split("&");
    for (const pair of pairs) {
      const [k, v] = pair.split("=");
      if (k) {
        result[k.trim()] = v ? v.trim() : "";
      }
    }
    return result;
  }
  const splitMatch = decoded.match(/^([a-zA-Z]+)[_:](.+)$/);
  if (splitMatch) {
    result[splitMatch[1]] = splitMatch[2];
    return result;
  }
  if (/^\d+$/.test(decoded)) {
    result.id = decoded;
    result.inviteUid = decoded;
    return result;
  }
  result.scene = decoded;
  return result;
}
function getLaunchQuery(enterOptions) {
  const opts = enterOptions || uni.getEnterOptionsSync();
  const rawQuery = opts && typeof opts === "object" && "query" in opts && opts.query ? opts.query : {};
  const query = { ...rawQuery };
  if (query.scene) {
    const parsed = parseScene(query.scene);
    Object.assign(query, parsed);
  }
  return query;
}

// src/common/func.ts
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// src/date/index.ts
function parseDate(val) {
  if (!val) {
    return 0;
  }
  if (typeof val === "number") {
    return val;
  }
  if (val instanceof Date) {
    return val.getTime();
  }
  return new Date(String(val).replace(/-/g, "/")).getTime() || 0;
}
function getTodayStr(date = /* @__PURE__ */ new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function isTimeInRange(startAt, endAt, now = Date.now()) {
  if (startAt) {
    const startTime = parseDate(startAt);
    if (startTime > 0 && now < startTime) {
      return false;
    }
  }
  if (endAt) {
    const endTime = parseDate(endAt);
    if (endTime > 0 && now > endTime) {
      return false;
    }
  }
  return true;
}
function formatDate(val, format = "YYYY-MM-DD HH:mm:ss") {
  const time = parseDate(val);
  if (!time) {
    return "";
  }
  const d = new Date(time);
  const opt = {
    "Y+": String(d.getFullYear()),
    "M+": String(d.getMonth() + 1).padStart(2, "0"),
    "D+": String(d.getDate()).padStart(2, "0"),
    "H+": String(d.getHours()).padStart(2, "0"),
    "m+": String(d.getMinutes()).padStart(2, "0"),
    "s+": String(d.getSeconds()).padStart(2, "0")
  };
  let result = format;
  for (const k in opt) {
    const reg = new RegExp(`(${k})`);
    if (reg.test(result)) {
      result = result.replace(reg, opt[k]);
    }
  }
  return result;
}

// src/canvas/index.ts
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
function drawImage(canvas, ctx, src, x, y, w, h) {
  return new Promise((resolve) => {
    let path = (src || "").trim();
    if (!path) {
      resolve();
      return;
    }
    if (path.startsWith("//")) {
      path = `https:${path}`;
    }
    let isDone = false;
    const done = () => {
      if (!isDone) {
        isDone = true;
        resolve();
      }
    };
    const tryDraw = (imgPath) => {
      const img = canvas.createImage();
      img.onload = () => {
        try {
          ctx.drawImage(img, x, y, w, h);
        } catch (err) {
          console.error("[drawImage] draw failed:", err);
        }
        done();
      };
      img.onerror = () => {
        if (imgPath.startsWith("/")) {
          const fallbackImg = canvas.createImage();
          fallbackImg.onload = () => {
            try {
              ctx.drawImage(fallbackImg, x, y, w, h);
            } catch {
            }
            done();
          };
          fallbackImg.onerror = () => done();
          fallbackImg.src = imgPath.slice(1);
          return;
        }
        done();
      };
      img.src = imgPath;
    };
    uni.getImageInfo({
      src: path,
      success(res) {
        tryDraw(res.path || path);
      },
      fail() {
        const altPath = path.startsWith("/") ? path.slice(1) : `/${path}`;
        uni.getImageInfo({
          src: altPath,
          success(altRes) {
            tryDraw(altRes.path || altPath);
          },
          fail() {
            tryDraw(path);
          }
        });
      }
    });
    setTimeout(done, 4e3);
  });
}
function drawRoundRectImage(canvas, ctx, src, x, y, w, h, r) {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    ctx.save();
    drawRoundRect(ctx, x, y, w, h, r);
    ctx.clip();
    drawImage(canvas, ctx, src, x, y, w, h).then(() => {
      ctx.restore();
      resolve();
    }).catch(() => {
      ctx.restore();
      resolve();
    });
  });
}
function drawCircleAvatar(canvas, ctx, src, cx, cy, r, strokeColor = "") {
  return new Promise((resolve) => {
    const path = (src || "").trim();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#F1F5F9";
    ctx.fill();
    ctx.clip();
    drawImage(canvas, ctx, path, cx - r, cy - r, r * 2, r * 2).then(() => {
      ctx.restore();
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      resolve();
    }).catch(() => {
      ctx.restore();
      resolve();
    });
  });
}
function drawTextWithSpacing(ctx, text, x, y, spacing = 0, align = "left", baseline = "middle") {
  if (!text) {
    return;
  }
  ctx.textBaseline = baseline;
  const chars = Array.from(text);
  if (!spacing || chars.length <= 1) {
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    return;
  }
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (chars.length - 1) * spacing;
  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }
  ctx.textAlign = "left";
  let curX = startX;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], curX, y);
    curX += widths[i] + spacing;
  }
}
function measureTextWithSpacing(ctx, text, spacing = 0) {
  if (!text) {
    return 0;
  }
  const chars = Array.from(text);
  if (!spacing || chars.length <= 1) {
    return ctx.measureText(text).width;
  }
  const charWidthSum = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0);
  return charWidthSum + (chars.length - 1) * spacing;
}

// src/navigator/index.ts
function resolveUrl(url, params) {
  let target = url.trim();
  if (!target.startsWith("http://") && !target.startsWith("https://") && !target.startsWith("/")) {
    target = "/" + target;
  }
  if (!params) return target;
  const entries = Object.entries(params).filter(
    ([_, v]) => v !== void 0 && v !== null && v !== ""
  );
  if (!entries.length) return target;
  const query = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
  return target.includes("?") ? `${target}&${query}` : `${target}?${query}`;
}
function handleFail(message, options) {
  if (!options?.silent) {
    uni.showToast({ title: message, icon: "none" });
  }
  options?.onFail?.(message);
  return false;
}
function navigate(type = "navigateTo", url = "", options = {}) {
  if (type === "navigateBack") {
    return new Promise((resolve) => {
      uni.navigateBack({
        delta: options.delta || 1,
        success: () => resolve(true),
        fail: (err) => {
          handleFail(err?.errMsg || "\u8FD4\u56DE\u4E0A\u4E00\u9875\u5931\u8D25", options);
          resolve(false);
        }
      });
    });
  }
  if (!url) {
    handleFail("\u8DF3\u8F6C\u76EE\u6807\u672A\u914D\u7F6E", options);
    return Promise.resolve(false);
  }
  if (type === "miniprogram") {
    return new Promise((resolve) => {
      uni.navigateToMiniProgram({
        appId: url,
        path: options.path ? resolveUrl(options.path, options.params) : "",
        envVersion: options.envVersion || "release",
        extraData: options.extraData,
        success: () => resolve(true),
        fail: (err) => {
          handleFail(err?.errMsg || "\u6253\u5F00\u5C0F\u7A0B\u5E8F\u5931\u8D25", options);
          resolve(false);
        }
      });
    });
  }
  const finalUrl = resolveUrl(url, options.params);
  return new Promise((resolve) => {
    const onFail = (err) => {
      handleFail(err?.errMsg || `\u65E0\u6CD5\u8DF3\u8F6C\uFF1A${finalUrl}`, options);
      resolve(false);
    };
    const onSuccess = () => resolve(true);
    switch (type) {
      case "redirectTo":
        uni.redirectTo({ url: finalUrl, success: onSuccess, fail: onFail });
        break;
      case "switchTab":
        uni.switchTab({ url: finalUrl, success: onSuccess, fail: onFail });
        break;
      case "reLaunch":
        uni.reLaunch({ url: finalUrl, success: onSuccess, fail: onFail });
        break;
      case "navigateTo":
      default:
        uni.navigateTo({ url: finalUrl, animationType: "none", success: onSuccess, fail: onFail });
        break;
    }
  });
}
function navigateTo(url, options) {
  return navigate("navigateTo", url, options);
}
function redirectTo(url, options) {
  return navigate("redirectTo", url, options);
}
function switchTab(url, options) {
  return navigate("switchTab", url, options);
}
function reLaunch(url, options) {
  return navigate("reLaunch", url, options);
}
function navigateBack(delta = 1, options = {}) {
  return navigate("navigateBack", "", { ...options, delta });
}
function navigateToMiniProgram(appId, options) {
  return navigate("miniprogram", appId, options);
}

// src/ad/popup.ts
var popupMap = /* @__PURE__ */ new Map();
function initPopupAd(adId) {
  if (!adId) return null;
  popupMap.get(adId)?.destroy?.();
  try {
    const ad = uni.createInterstitialAd({ adUnitId: adId });
    popupMap.set(adId, ad);
    return ad;
  } catch {
    return null;
  }
}
function setPopupAd(adId) {
  return !!(popupMap.get(adId) || initPopupAd(adId));
}
async function showPopupAd(adId, delay = 0) {
  if (!adId) return false;
  if (delay > 0) await new Promise((r) => setTimeout(r, delay));
  let ad = popupMap.get(adId) || initPopupAd(adId);
  if (!ad) return false;
  try {
    await ad.show();
    return true;
  } catch {
    ad = initPopupAd(adId);
    return ad ? ad.show().then(() => true).catch(() => false) : false;
  }
}

// src/ad/reward.ts
var rewardMap = /* @__PURE__ */ new Map();
function destroyRewardAd(adId) {
  if (!adId) return;
  try {
    rewardMap.get(adId)?.destroy?.();
  } catch {
  }
  rewardMap.delete(adId);
}
function getRewardInstance(unitId) {
  let ad = rewardMap.get(unitId);
  if (!ad) {
    try {
      ad = uni.createRewardedVideoAd({ adUnitId: unitId });
      rewardMap.set(unitId, ad);
    } catch {
      return null;
    }
  }
  return ad;
}
async function triggerRewardAd(ad, onShow) {
  try {
    await ad.show();
  } catch {
    await ad.load();
    await ad.show();
  }
  onShow?.();
}
function showRewardAd(options) {
  const unitId = typeof options === "string" ? options : options?.unitId;
  const onShow = typeof options === "object" ? options.onShow : void 0;
  if (!unitId) return Promise.resolve({ success: false, isEnded: false });
  const ad = getRewardInstance(unitId);
  if (!ad) return Promise.resolve({ success: false, isEnded: false });
  return new Promise((resolve) => {
    let finished = false;
    const cleanup = () => {
      ad.offClose(onClose);
      ad.offError(onError);
    };
    const onClose = (res) => {
      if (finished) return;
      finished = true;
      cleanup();
      const isEnded = Boolean(res?.isEnded);
      resolve({ success: isEnded, isEnded });
    };
    const onError = (error2) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve({ success: false, isEnded: false, error: error2 });
    };
    ad.onClose(onClose);
    ad.onError(onError);
    triggerRewardAd(ad, onShow).catch(onError);
  });
}
function confirmRewardAd() {
  return new Promise((resolve) => {
    uni.showModal({
      title: "\u63D0\u793A",
      content: "\u9700\u8981\u770B\u5B8C\u5E7F\u544A\u624D\u6709\u5956\u52B1\u54E6",
      cancelText: "\u53D6\u6D88",
      confirmText: "\u7EE7\u7EED\u89C2\u770B",
      cancelColor: "#999999",
      confirmColor: "#3b82f6",
      success: (res) => resolve(Boolean(res.confirm)),
      fail: () => resolve(false)
    });
  });
}
async function playRewardAd(options = {}) {
  const { unitId = "", retryConfirm = true } = options;
  if (!unitId) return { success: false, isEnded: false };
  uni.showLoading({ title: "\u6B63\u5728\u62C9\u8D77\u5E7F\u544A", mask: true });
  const timer = setTimeout(() => uni.hideLoading(), 8e3);
  try {
    const result = await showRewardAd({
      unitId,
      onShow: () => uni.hideLoading()
    });
    destroyRewardAd(unitId);
    if (result.success && result.isEnded) {
      return result;
    }
    if (retryConfirm && !result.isEnded && !result.error) {
      const retry = await confirmRewardAd();
      if (retry) {
        return await playRewardAd(options);
      }
    }
    return result;
  } catch (error2) {
    destroyRewardAd(unitId);
    return { success: false, isEnded: false, error: error2 };
  } finally {
    clearTimeout(timer);
    uni.hideLoading();
  }
}

// src/msg/index.ts
function toast(opts, callback) {
  let msg2 = "";
  let isModal = false;
  let modalOptions;
  let toastOptions;
  if (typeof opts === "string") {
    msg2 = opts;
  } else if ("msg" in opts) {
    msg2 = opts.msg || "";
    isModal = Boolean(opts.modal);
    modalOptions = opts.modalOptions;
  } else if ("title" in opts) {
    msg2 = opts.title || "";
    toastOptions = opts;
  }
  if (!msg2) {
    callback?.(true);
    return Promise.resolve(true);
  }
  if (isModal) {
    return modal({
      ...modalOptions,
      content: msg2
    }).then((confirm) => {
      callback?.(confirm);
      return confirm;
    });
  }
  uni.showToast({
    title: msg2,
    icon: toastOptions?.icon || "none",
    image: toastOptions?.image,
    duration: toastOptions?.duration || 2e3,
    mask: toastOptions?.mask || false,
    position: toastOptions?.position || "center"
  });
  callback?.(true);
  return Promise.resolve(true);
}
function success(msg2) {
  if (!msg2) {
    return;
  }
  uni.showToast({ title: msg2, icon: "success", duration: 2e3 });
}
function error(msg2) {
  if (!msg2) {
    return;
  }
  uni.showToast({ title: msg2, icon: "error", duration: 2e3 });
}
function showLoading(msg2 = "\u52A0\u8F7D\u4E2D...") {
  uni.showLoading({ title: msg2, mask: true });
}
function hideLoading() {
  uni.hideLoading();
}
function modal(opts = {}) {
  return new Promise((resolve) => {
    const {
      title = "\u63D0\u793A",
      content,
      confirmText = "\u786E\u5B9A",
      cancelText = "\u53D6\u6D88",
      confirmColor = "#3b82f6",
      cancelColor = "#999999",
      showCancel = true
    } = opts || {};
    uni.showModal({
      title,
      content,
      confirmText,
      cancelText,
      confirmColor,
      cancelColor,
      showCancel,
      success: (res) => resolve(Boolean(res.confirm)),
      fail: () => resolve(false)
    });
  });
}
var msg = {
  toast,
  success,
  error,
  showLoading,
  hideLoading,
  modal
};
var useMsg = () => msg;
var hlw = {
  $msg: msg
};

// src/device/index.ts
var deviceCache = null;
var currentNetworkType = "";
uni.getNetworkType({
  success(res) {
    currentNetworkType = res.networkType || "";
    if (deviceCache) {
      deviceCache.networkType = currentNetworkType;
    }
  }
});
uni.onNetworkStatusChange((res) => {
  currentNetworkType = res.networkType || "";
  if (deviceCache) {
    deviceCache.networkType = currentNetworkType;
  }
});
function getDevice() {
  if (deviceCache) return deviceCache;
  const deviceRaw = uni.getDeviceInfo();
  const windowRaw = uni.getWindowInfo();
  const appRaw = uni.getAppBaseInfo();
  const accountRaw = uni.getAccountInfoSync();
  const system = deviceRaw.system || "";
  deviceCache = {
    appid: accountRaw.miniProgram?.appId || "",
    appName: appRaw.appName || "",
    version: appRaw.appVersion || "",
    versionCode: appRaw.appVersionCode || "",
    channel: appRaw.appChannel || "",
    deviceId: deviceRaw.deviceId || "",
    deviceType: deviceRaw.deviceType || "",
    deviceOrientation: deviceRaw.deviceOrientation || windowRaw.deviceOrientation || "portrait",
    brand: deviceRaw.brand || "",
    model: deviceRaw.model || "",
    system,
    os: system.split(" ")[0] || "",
    pixelRatio: windowRaw.pixelRatio || 0,
    screenWidth: windowRaw.screenWidth || 0,
    screenHeight: windowRaw.screenHeight || 0,
    windowWidth: windowRaw.windowWidth || 0,
    windowHeight: windowRaw.windowHeight || 0,
    statusBarHeight: windowRaw.statusBarHeight || 0,
    sdkVersion: appRaw.SDKVersion || "",
    hostName: appRaw.hostName || "",
    hostVersion: appRaw.hostVersion || "",
    hostLanguage: appRaw.hostLanguage || "",
    hostTheme: appRaw.hostTheme || "",
    platform: deviceRaw.platform || "",
    language: appRaw.appLanguage || appRaw.language || "",
    networkType: currentNetworkType,
    benchmarkLevel: deviceRaw.benchmarkLevel || 0,
    theme: appRaw.theme || "light",
    fontSizeSetting: appRaw.fontSizeSetting || 16
  };
  return deviceCache;
}

// src/dom/index.ts
function getRect(selector, context) {
  return new Promise((resolve) => {
    const query = context ? uni.createSelectorQuery().in(context) : uni.createSelectorQuery();
    query.select(selector).boundingClientRect((res) => {
      if (res && !Array.isArray(res)) {
        resolve(res);
      } else {
        resolve(null);
      }
    }).exec();
  });
}
function getAllRect(selector, context) {
  return new Promise((resolve) => {
    const query = context ? uni.createSelectorQuery().in(context) : uni.createSelectorQuery();
    query.selectAll(selector).boundingClientRect((res) => {
      if (Array.isArray(res)) {
        resolve(res);
      } else {
        resolve([]);
      }
    }).exec();
  });
}

// src/permission/index.ts
var DEFAULT_SCOPE_NAMES = {
  "scope.writePhotosAlbum": "\u76F8\u518C\u4FDD\u5B58",
  "scope.camera": "\u76F8\u673A\u62CD\u6444",
  "scope.record": "\u9EA6\u514B\u98CE\u5F55\u97F3",
  "scope.userLocation": "\u5730\u7406\u4F4D\u7F6E",
  "scope.bluetooth": "\u84DD\u7259\u8BBE\u5907",
  "scope.addPhoneContact": "\u901A\u8BAF\u5F55"
};
function checkPermission(scope, options = {}) {
  return new Promise((resolve) => {
    resolve(true);
    return;
    uni.getSetting({
      success(res) {
        const auth2 = res.authSetting;
        if (auth2 && auth2[scope] === true) {
          resolve(true);
          return;
        }
        if (!auth2 || auth2[scope] === void 0) {
          uni.authorize({
            scope,
            success() {
              resolve(true);
            },
            fail() {
              resolve(false);
            }
          });
          return;
        }
        const scopeName = DEFAULT_SCOPE_NAMES[scope] || "\u76F8\u5173";
        const title = options.title || "\u6388\u6743\u63D0\u793A";
        const content = options.content || `\u9700\u8981\u4F7F\u7528${scopeName}\u529F\u80FD\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u5F00\u542F\u6743\u9650`;
        const confirmText = options.confirmText || "\u53BB\u8BBE\u7F6E";
        const cancelText = options.cancelText || "\u53D6\u6D88";
        uni.showModal({
          title,
          content,
          confirmText,
          cancelText,
          success(modalRes) {
            if (modalRes.confirm) {
              uni.openSetting({
                success(settingRes) {
                  const authSetting = settingRes.authSetting;
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
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  auth,
  buildUrl,
  checkAppUpdate,
  checkPermission,
  confirmRewardAd,
  copy,
  debounce,
  destroyRewardAd,
  download,
  drawCircleAvatar,
  drawImage,
  drawRoundRect,
  drawRoundRectImage,
  drawTextWithSpacing,
  error,
  formatConvertNumber,
  formatDate,
  formatFileSize,
  formatNum,
  formatNumber,
  getAllRect,
  getClipboardText,
  getDevice,
  getLaunchQuery,
  getNumber,
  getRect,
  getTodayStr,
  hideLoading,
  hlw,
  initPopupAd,
  isPageMatch,
  isTimeInRange,
  measureTextWithSpacing,
  modal,
  msg,
  navigate,
  navigateBack,
  navigateTo,
  navigateToMiniProgram,
  parseDate,
  parseScene,
  paste,
  playRewardAd,
  reLaunch,
  redirectTo,
  safeDecode,
  saveImage,
  saveImageUrl,
  saveVideoFile,
  saveVideoUrl,
  setClipboardText,
  setPopupAd,
  showLoading,
  showPopupAd,
  showRewardAd,
  success,
  switchTab,
  throttle,
  toBoolean,
  toNumber,
  toQuery,
  toast,
  useMsg,
  withQuery
});
