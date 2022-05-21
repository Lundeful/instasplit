import { PixelCrop } from 'react-image-crop';

export const getCrop = (width: number, height: number, aspect: number): PixelCrop => {
  // We prefer full width crop, so we adjust height based on aspect ratio
  const adjustedHeight = width / aspect;

  // If height is taller than image then we scale the crop
  const multiplier = adjustedHeight > height ? height / adjustedHeight : 1;
  const scaledHeight = adjustedHeight * multiplier;
  const scaledWidth = width * multiplier;

  // Place crop in center
  const xCoordinate = multiplier < 1 ? (width - scaledWidth) / 2 : 0;
  const yCoordinate = multiplier < 1 ? 0 : (height - adjustedHeight) / 2;

  return { width: scaledWidth, height: scaledHeight, x: xCoordinate, y: yCoordinate, unit: 'px' };
};
