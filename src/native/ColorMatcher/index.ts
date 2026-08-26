let ColorMatcherModule: ColorMatcher | null = null;
try {
  const { NitroModules } = require('react-native-nitro-modules');
  if (NitroModules && typeof NitroModules.createHybridObject === 'function') {
    ColorMatcherModule = NitroModules.createHybridObject('ColorMatcher');
  }
} catch {
  ColorMatcherModule = null;
}

export { ColorMatcherModule };

/**
 * Color matching using C++ via Nitro with pure JS fallback for web
 */
export function matchColorsNative(
  cellRGB: number[],
  cellIndices: number[],
  photoRGB: number[],
  photoIds: number[],
): Map<number, number> {
  const mapping = new Map<number, number>();

  if (ColorMatcherModule && typeof ColorMatcherModule.matchColorsRGB === 'function') {
    try {
      const resultArray = ColorMatcherModule.matchColorsRGB(
        cellRGB,
        cellIndices,
        photoRGB,
        photoIds,
      );
      for (let i = 0; i < resultArray.length; i += 2) {
        mapping.set(resultArray[i], resultArray[i + 1]);
      }
      return mapping;
    } catch {
      // Fall back to JS matching below
    }
  }

  // Pure JS fallback: simple nearest color matching
  for (let i = 0; i < cellIndices.length; i++) {
    const cR = cellRGB[i * 3];
    const cG = cellRGB[i * 3 + 1];
    const cB = cellRGB[i * 3 + 2];
    let bestDist = Infinity;
    let bestPhotoId = photoIds[0] || 0;

    for (let j = 0; j < photoIds.length; j++) {
      const pR = photoRGB[j * 3];
      const pG = photoRGB[j * 3 + 1];
      const pB = photoRGB[j * 3 + 2];
      const dist = (cR - pR) ** 2 + (cG - pG) ** 2 + (cB - pB) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        bestPhotoId = photoIds[j];
      }
    }
    mapping.set(cellIndices[i], bestPhotoId);
  }

  return mapping;
}
