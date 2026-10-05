/**
 * 绘制圆角矩形路径
 */
export function drawRoundRect(ctx: any, x: number, y: number, w: number, h: number, r: number): void {
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
