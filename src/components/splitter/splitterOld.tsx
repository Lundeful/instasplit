import { useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// import useStyles from './Splitter.styles';

export const SplitterOld = ({ imgSrc }: { imgSrc: string }) => {
  // const { classes } = useStyles();

  // Image state
  const [loading, setLoading] = useState(false);
  // const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  // const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setCrop(undefined); // Makes crop preview update between images.
  //     const reader = new FileReader();
  //     reader.addEventListener('load', () => {
  //       setImgSrc(reader.result?.toString() || '');
  //       setLoading(false);
  //     });
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(e);

    const { width, height } = e.currentTarget;
    setCrop({ width: width, height: height, x: 100, y: 100, unit: 'px' });
  };

  // if (!imgSrc) {
  //   return <input type='file' accept='image/*' onChange={onSelectFile} />;
  // }

  if (loading) {
    return <h1>Loading</h1>;
  }

  return (
    <div className='cropContainer'>
      <ReactCrop minHeight={100} minWidth={100} crop={crop} onChange={crop => setCrop(crop)} onComplete={setCompletedCrop}>
        <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} />
      </ReactCrop>
    </div>
  );
};
