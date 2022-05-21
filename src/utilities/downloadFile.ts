// Temporarily create a link to trigger download
// This hack is required because of bad browser support for the cool solutions
export const downloadFile = (croppedImage: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = croppedImage;
  const fileType = croppedImage.split(';').shift()?.split('/').pop() ?? 'jpg';
  a.download = `${fileName}.${fileType}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
