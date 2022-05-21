import { AspectRatios } from '../components/splitter/types';

export const getAspectRatio = (
  desiredRatio: string,
  numberOfSplits: number,
  customRatio: { width: number; height: number },
  imageWidth?: number,
  imageHeight?: number
) => {
  // Free aspect ratio
  if (!desiredRatio || desiredRatio === 'free') {
    return undefined;
  }

  // Custom aspect ratio
  if (desiredRatio === 'custom') {
    const aspect = customRatio.width / customRatio.height;
    return aspect * numberOfSplits;
  }

  if (desiredRatio === 'original') {
    if (!imageWidth || !imageHeight) return undefined;
    const aspect = imageWidth / imageHeight;
    return aspect * numberOfSplits;
  }

  // Use pre-defined aspect ratio
  const newRatio = AspectRatios.find(ar => ar.value === desiredRatio);
  // Couldn't find aspect ratio
  if (!newRatio) {
    return undefined;
  }

  // Pre-defined aspect ratio
  if (newRatio.aspect) {
    return newRatio.aspect * numberOfSplits;
  }
};
