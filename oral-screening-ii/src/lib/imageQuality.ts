// On-device quality grade for each capture. These are advisory heuristics
// (exposure + sharpness), not clinically validated — tune the thresholds
// against real field photos before relying on them.

export type QualityGrade = "poor" | "fine" | "best";

export type QualityResult = {
  grade: QualityGrade;
  // Short reason when the grade is poor, e.g. "Too dark".
  reason?: string;
};

// Sharpness bands measured on the reference photos at this sample width:
// crisp ≈ 220–470, slight blur ≈ 110–210, moderate blur ≈ 20–95.
const SAMPLE_WIDTH = 160;
const DARK_LUMA = 55;
const BRIGHT_LUMA = 215;
const BLUR_VARIANCE = 50;
// "Best" needs comfortable exposure and clearly sharp detail.
const BEST_LUMA_MIN = 80;
const BEST_LUMA_MAX = 190;
const BEST_VARIANCE = 200;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function gradeImage(url: string): Promise<QualityResult> {
  try {
    const img = await loadImage(url);
    const width = SAMPLE_WIDTH;
    const height = Math.max(3, Math.round((img.naturalHeight / img.naturalWidth) * width));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { grade: "fine" };
    ctx.drawImage(img, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    const luma = new Float32Array(width * height);
    let sum = 0;
    for (let i = 0; i < luma.length; i++) {
      const v = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
      luma[i] = v;
      sum += v;
    }
    const mean = sum / luma.length;

    // Variance of the Laplacian: low values mean few sharp edges, i.e. blur.
    let lapSum = 0;
    let lapSqSum = 0;
    let n = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const lap = luma[i - 1] + luma[i + 1] + luma[i - width] + luma[i + width] - 4 * luma[i];
        lapSum += lap;
        lapSqSum += lap * lap;
        n++;
      }
    }
    const sharpness = n ? lapSqSum / n - (lapSum / n) ** 2 : 0;

    if (mean < DARK_LUMA) return { grade: "poor", reason: "Too dark" };
    if (mean > BRIGHT_LUMA) return { grade: "poor", reason: "Overexposed" };
    if (sharpness < BLUR_VARIANCE) return { grade: "poor", reason: "Blurry" };
    if (mean >= BEST_LUMA_MIN && mean <= BEST_LUMA_MAX && sharpness >= BEST_VARIANCE) {
      return { grade: "best" };
    }
    return { grade: "fine" };
  } catch {
    // Can't analyse (e.g. decode failure) — don't penalise the photo.
    return { grade: "fine" };
  }
}
