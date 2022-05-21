import { Crop, PercentCrop, PixelCrop } from 'react-image-crop';

export const getCroppedImages = (image: HTMLImageElement, numberOfSplits: number, crop: PixelCrop, mimeType: string): string[] => {
  if (process.env.NODE_ENV === 'development') {
    console.log('image', image);
    console.log('crop', crop);
  }

  if (crop.unit !== 'px') {
    console.error("Crop unit was not in 'px'");
    throw new Error('Error while cropping image, see logs for more details');
  }

  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Couldn't get 2d context");
    throw new Error('Error while cropping image, see logs for more details');
  }

  canvas.hidden = true;
  ctx.imageSmoothingQuality = 'high';

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const outputX = crop.width * scaleX;
  const outputY = crop.height * scaleY;

  console.log('cropX', cropX);
  console.log('cropY', cropY);

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  canvas.width = outputX;
  canvas.height = outputY;

  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);

  const fileType = image.src.split(';').shift()?.split('/').pop();
  const croppedImageData = canvas.toDataURL();
  canvas.remove();
  return [croppedImageData];
};
