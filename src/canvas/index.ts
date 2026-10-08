/**
 * @hlw-uni-mp/utils Canvas 2D 绘图与海报生成辅助工具集
 */

/**
 * 绘制圆角矩形路径
 */
export function drawRoundRect(ctx: any, x: number, y: number, w: number, h: number, r: number): void {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.closePath();
}



/**
 * 填充圆角矩形
 */
export function fillRoundRect(
    ctx: any,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    color: string | any,
): void {
    ctx.fillStyle = color;
    drawRoundRect(ctx, x, y, w, h, r);
    ctx.fill();
}

/**
 * 描边圆角矩形
 */
export function strokeRoundRect(
    ctx: any,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    color: string,
    lineWidth = 1,
): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    drawRoundRect(ctx, x, y, w, h, r);
    ctx.stroke();
}

/**
 * 异步加载 Canvas 图片（微信小程序 2D Canvas 模式 createImage）
 * 自动处理网络地址通过 getImageInfo 转本地临时路径，支持超时与异常容错
 */
export function loadCanvasImage(canvas: any, src: string): Promise<any | null> {
    const path = (src || "").trim();
    if (!path) return Promise.resolve(null);

    return new Promise((resolve) => {
        let isDone = false;
        const done = (img: any | null) => {
            if (!isDone) {
                isDone = true;
                resolve(img);
            }
        };

        const tryCreate = (finalSrc: string) => {
            try {
                const img = canvas.createImage();
                img.onload = () => done(img);
                img.onerror = () => done(null);
                img.src = finalSrc;
            } catch {
                done(null);
            }
        };

        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("//")) {
            const httpPath = path.startsWith("//") ? `https:${path}` : path;
            uni.getImageInfo({
                src: httpPath,
                success: (res) => tryCreate(res.path || httpPath),
                fail: () => tryCreate(httpPath),
            });
        } else {
            tryCreate(path);
        }

        // 5秒超时保底
        setTimeout(() => done(null), 5000);
    });
}

/**
 * 初始化微信小程序 2D Canvas 节点与上下文，自动按 DPR 缩放
 */
export interface InitCanvas2DResult {
    canvas: any;
    ctx: any;
    dpr: number;
}

export function initCanvas2D(
    selector: string,
    width: number,
    height: number,
    instance?: any,
): Promise<InitCanvas2DResult> {
    return new Promise((resolve, reject) => {
        let query = uni.createSelectorQuery();
        if (instance) {
            query = query.in(instance);
        }
        query
            .select(selector)
            .fields({ node: true, size: true }, () => {})
            .exec((res) => {
                if (!res || !res[0] || !res[0].node) {
                    reject(new Error(`[initCanvas2D] 未找到 Canvas 节点：${selector}`));
                    return;
                }
                const canvas = res[0].node;
                const ctx = canvas.getContext("2d");
                const dpr = uni.getWindowInfo?.()?.pixelRatio || 2;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);
                resolve({ canvas, ctx, dpr });
            });
    });
}

/**
 * 导出 Canvas 到临时图片路径（Promise 风格封装）
 */
export interface ExportCanvasOption {
    canvas?: any;
    canvasId?: string;
    width?: number;
    height?: number;
    fileType?: "jpg" | "png";
    quality?: number;
    component?: any;
    delayMs?: number;
}

export function exportCanvasToImage(options: ExportCanvasOption): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const config: any = {
                fileType: options.fileType || "png",
                quality: options.quality ?? 1,
                success: (res: any) => resolve(res.tempFilePath),
                fail: (err: any) => reject(err),
            };
            if (options.canvas) config.canvas = options.canvas;
            if (options.canvasId) config.canvasId = options.canvasId;
            if (options.width) config.destWidth = options.width * 2;
            if (options.height) config.destHeight = options.height * 2;

            uni.canvasToTempFilePath(config, options.component);
        }, options.delayMs ?? 150);
    });
}

/**
 * 绘制圆形头像（支持有图与无图首字优雅降级）
 */
export interface DrawAvatarOption {
    bgColor?: string;
    textColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fontSize?: number;
}

export function drawAvatarWithFallback(
    ctx: any,
    avatarImg: any | null,
    name: string,
    x: number,
    y: number,
    size: number,
    options?: DrawAvatarOption,
): void {
    const r = size / 2;
    const cx = x + r;
    const cy = y + r;
    const bgColor = options?.bgColor || "#059669";
    const textColor = options?.textColor || "#FFFFFF";
    const strokeColor = options?.strokeColor || "#E2E8F0";
    const strokeWidth = options?.strokeWidth ?? 1.5;
    const fontSize = options?.fontSize || Math.round(size * 0.4);

    if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, x, y, size, size);
        ctx.restore();

        if (strokeColor && strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else {
        fillRoundRect(ctx, x, y, size, size, r, bgColor);
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const firstChar = (name || "牌").trim().charAt(0).toUpperCase() || "牌";
        ctx.fillText(firstChar, cx, cy);
    }
}

/**
 * 单行文本绘制并在超出 maxWidth 时自动截断并补充省略号 "..."
 */
export function drawTextEllipsis(
    ctx: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    align: "left" | "center" | "right" = "left",
    baseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom" = "alphabetic",
): string {
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    const str = text || "";
    if (!str || ctx.measureText(str).width <= maxWidth) {
        ctx.fillText(str, x, y);
        return str;
    }
    let truncated = str;
    while (truncated.length > 0 && ctx.measureText(`${truncated}...`).width > maxWidth) {
        truncated = truncated.slice(0, -1);
    }
    const result = `${truncated}...`;
    ctx.fillText(result, x, y);
    return result;
}

/**
 * 异步下载并绘制图片（自动支持网络图片与本地静态图片）
 */
export function drawImage(
    canvas: any,
    ctx: any,
    src: string,
    x: number,
    y: number,
    w: number,
    h: number,
): Promise<void> {
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

        const tryDraw = (imgPath: string): void => {
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
                        } catch {}
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
                    },
                });
            },
        });

        // 4秒超时兜底保护
        setTimeout(done, 4000);
    });
}

/**
 * 绘制带圆角的图片
 */
export function drawRoundRectImage(
    canvas: any,
    ctx: any,
    src: string,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
): Promise<void> {
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

/**
 * 绘制圆形头像（支持网络头像与本地默认头像，自动填充圆形浅灰底色）
 */
export function drawCircleAvatar(
    canvas: any,
    ctx: any,
    src: string,
    cx: number,
    cy: number,
    r: number,
    strokeColor = "",
): Promise<void> {
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

/**
 * 绘制带字间距的文本 (默认垂直居中对齐 textBaseline = 'middle')
 */
export function drawTextWithSpacing(
    ctx: any,
    text: string,
    x: number,
    y: number,
    spacing = 0,
    align: "left" | "center" | "right" = "left",
    baseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom" = "middle",
): void {
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

/**
 * 测量带字间距文本总宽度
 */
export function measureTextWithSpacing(ctx: any, text: string, spacing = 0): number {
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
