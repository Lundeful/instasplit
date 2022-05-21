import { PixelCrop } from 'react-image-crop';

export const getCroppedImages = (image: HTMLImageElement, numberOfSplits: number, crop: PixelCrop, mimeType: string): string[] => {
  const croppedImages: string[] = [];

  if (crop.unit !== 'px') {
    console.error("Crop unit was not in 'px'");
    throw new Error('Error while cropping image');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Couldn't get 2d context");
    throw new Error('Error while cropping image');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const outputWidth = (crop.width * scaleX) / numberOfSplits;
  const outputHeight = crop.height * scaleY;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.imageSmoothingQuality = 'high';
  ctx.save();

  for (let i = 0; i < numberOfSplits; i++) {
    const cropX = crop.x * scaleX + outputWidth * i;
    const cropY = crop.y * scaleY;

    ctx.drawImage(image, -cropX, -cropY);
    croppedImages.push(canvas.toDataURL(mimeType, 1));
    ctx.restore();
  }

  canvas.remove();
  return croppedImages;
};
