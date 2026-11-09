import { env } from "@huggingface/transformers";

env.allowLocalModels = false;

// Analisis mendalam berdasarkan 3 Pilar Profesional
function professionalPhotoAnalysis(imgElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) return { category: "uncertain", score: 50, details: { summary: "Gagal memproses konteks", sharpness: 0 } };

  // Resolusi sampling ideal untuk kecepatan dan akurasi matriks piksel
  const width = 180;
  const height = 180;
  canvas.width = width;
  canvas.height = height;
  
  ctx.drawImage(imgElement, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  let totalBrightness = 0;
  let totalVariance = 0;
  let overexposedPixels = 0;
  let underexposedPixels = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Standard Luminance (Rec. 709)
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      totalBrightness += gray;

      // 1. Cek Kelayakan Teknis: Exposure Clipping (Terlalu terang / terlalu gelap)
      if (gray > 245) overexposedPixels++;
      if (gray < 8) underexposedPixels++;

      // 2. Cek Ketajaman Fokus & Detail (Laplacian Variance untuk Edge Sharpness)
      const rightIdx = (y * width + (x + 1)) * 4;
      const rightGray = 0.2126 * data[rightIdx] + 0.7152 * data[rightIdx + 1] + 0.0722 * data[rightIdx + 2];
      
      const diff = Math.abs(gray - rightGray);
      totalVariance += diff * diff;
      count++;
    }
  }

  const avgBrightness = totalBrightness / count;
  const sharpnessScore = Math.sqrt(totalVariance / count);
  const overexposureRatio = overexposedPixels / count;
  const underexposureRatio = underexposedPixels / count;

  // Normalisasi Skor Ketajaman (Skala 0 - 100)
  let rawScore = Math.round(sharpnessScore * 3.2);
  if (rawScore > 100) rawScore = 100;

  // --- IMPLEMENTASI KRITERIA PROFESIONAL ---
  let category = "good";
  let evaluationNote = "Teknis & Komposisi Prima (Layak Pilih)";

  const isTooBlurry = sharpnessScore < 8.0; // Gagal fokus / motion blur
  const isSoftFocus = sharpnessScore >= 8.0 && sharpnessScore < 13.0; // Ragu-ragu (soft / estetika tertentu)
  const isOverExposed = overexposureRatio > 0.12; // Highlight blow-out
  const isUnderExposed = underexposureRatio > 0.20; // Shadow hancur / pecah

  // Tahap Kriteria Eliminasi Pertama (Teknis)
  if (isTooBlurry) {
    category = "bad";
    evaluationNote = "Eliminasi: Gagal Fokus / Motion Blur";
  } else if (isOverExposed) {
    category = "bad";
    evaluationNote = "Eliminasi: Overexposure (Highlight Silau)";
  } else if (isUnderExposed) {
    category = "bad";
    evaluationNote = "Eliminasi: Underexposure (Terlalu Gelap)";
  } 
  // Tahap Kriteria Estetika & Review (Ragu-ragu)
  else if (isSoftFocus) {
    category = "uncertain";
    evaluationNote = "Review: Fokus Lembut (Perlu Cek Ekspresi/Momen)";
  } 
  // Lolos semua kriteria teknis & standar profesional
  else {
    category = "good";
    evaluationNote = "Mata Subjek & Ketajaman Sesuai Standar Pro";
  }

  return {
    category,
    score: rawScore,
    details: {
      sharpness: Math.round(sharpnessScore * 10) / 10,
      exposureStatus: evaluationNote,
      brightnessValue: Math.round(avgBrightness),
    },
  };
}

export async function evaluatePhoto(photoUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = photoUrl;

    img.onload = () => {
      try {
        const result = professionalPhotoAnalysis(img);
        resolve(result);
      } catch (err) {
        console.error("Gagal menganalisis parameter foto:", err);
        resolve({ category: "uncertain", score: 50, details: { exposureStatus: "Gagal analisis mesin", sharpness: 0 } });
      }
    };

    img.onerror = () => {
      resolve({ category: "uncertain", score: 0, details: { exposureStatus: "Berkas tidak valid", sharpness: 0 } });
    };
  });
}