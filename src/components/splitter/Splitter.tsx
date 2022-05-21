import 'react-image-crop/dist/ReactCrop.css';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  Container,
  Group,
  Image,
  InputWrapper,
  Loader,
  NumberInput,
  Select,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowBackUp, ArrowsHorizontal, ArrowsVertical, Tool, X } from 'tabler-icons-react';
import { RouteKeys } from '../../App';
import { IncrementedNumberInput } from '../formcomponents/IncrementedNumberInput';
import { useDidUpdate } from '@mantine/hooks';
import useStyles from './Splitter.styles';
import { getCroppedImages } from '../../utilities/GetCroppedImage';
import { AspectRatios } from './types';

export const Splitter = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  // Route state
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Image and crop state
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasPreviewRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({ width: 100, height: 50, x: 0, y: 25, unit: '%' });
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>();

  // Crop tools state
  const [showTools, setShowTools] = useState(false);
  const [showPreviewLines, setShowPreviewLines] = useState(true);
  const [numberOfSplits, setNumberOfSplits] = useState(2);
  const [desiredRatio, setDesiredRatio] = useState<string>('free');
  const [customRatio, setCustomRatio] = useState<{ width: number; height: number }>({ width: 1, height: 1 });

  useEffect(() => {
    // Free aspect ratio
    if (!desiredRatio || desiredRatio === 'free') {
      setAspect(undefined);
      return;
    }

    // Custom aspect ratio
    if (desiredRatio === 'custom') {
      const aspect = customRatio.width / customRatio.height;
      setAspect(aspect * numberOfSplits);
      return;
    }

    if (desiredRatio === 'original') {
      const width = imgRef.current?.width;
      const height = imgRef.current?.height;
      if (!width || !height) return;

      const aspect = width / height;
      setAspect(aspect * numberOfSplits);
      return;
    }

    // Use pre-defined aspect ratio
    const newRatio = AspectRatios.find(ar => ar.value === desiredRatio);
    // Couldn't find aspect ratio
    if (!newRatio) {
      setAspect(undefined);
      return;
    }

    // Pre-defined aspect ratio
    if (newRatio.aspect) {
      setAspect(newRatio.aspect * numberOfSplits);
      return;
    }
  }, [desiredRatio, numberOfSplits, customRatio]);

  useDidUpdate(() => {
    if (desiredRatio === 'free' || !aspect || !imgRef.current) return;

    const { width, height } = imgRef.current;

    // We prefer full width crop, so we adjust height based on aspect ratio
    const adjustedHeight = width / aspect;

    // If height is taller than image then we scale the crop
    const multiplier = adjustedHeight > height ? height / adjustedHeight : 1;
    const scaledHeight = adjustedHeight * multiplier;
    const scaledWidth = width * multiplier;

    // Place crop in center
    const xCoordinate = multiplier < 1 ? (width - scaledWidth) / 2 : 0;
    const yCoordinate = multiplier < 1 ? 0 : (height - adjustedHeight) / 2;

    const crop: PixelCrop = { width: scaledWidth, height: scaledHeight, x: xCoordinate, y: yCoordinate, unit: 'px' };
    setCrop(crop);
    setCompletedCrop(crop);
  }, [aspect]);

  const loadImageData = useCallback(() => {
    const file = location.state as File;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setLoading(false);
    });
    reader.readAsDataURL(file);
  }, [location.state]);

  useEffect(loadImageData, [loadImageData]);

  // If state was not passed then we GTFO
  if (!location.state) {
    navigate(RouteKeys.Upload);
  }

  const PreviewLines = () =>
    useMemo(() => {
      return (
        <Box className={classes.previewLinesContainer}>
          {[...Array(numberOfSplits - 1)].map((e, i) => (
            <Box key={i} className={classes.previewLine} />
          ))}
        </Box>
      );
    }, [numberOfSplits]);

  const handleSubmit = () => {
    if (!completedCrop || !imgRef.current || !canvasPreviewRef.current) {
      // Todo: Display error message to user
      return;
    }

    try {
      const file = location.state as File;
      const originalFileName = file.name.split('.');
      originalFileName.pop();
      const images = getCroppedImages(imgRef.current, numberOfSplits, completedCrop as PixelCrop, file.type);
      images.forEach((image, i) => download(image, `${originalFileName}_${i + 1}`));
    } catch (e) {
      console.error(e);
      // TODO: Display error message to user
    }
  };

  // Temporarily create a link to trigger download
  // This hack is required because of bad browser support for the cool solutions
  const download = (croppedImage: string, fileName: string = 'instasplit') => {
    const a = document.createElement('a');
    a.href = croppedImage;
    const fileType = croppedImage.split(';').shift()?.split('/').pop() ?? 'jpg';
    a.download = `${fileName}.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container>
      <Box mb='sm'>
        <Group spacing='md' my='xs' position='apart'>
          <Button variant='light' leftIcon={<ArrowBackUp />} component={Link} to={RouteKeys.Upload}>
            Back
          </Button>
          <Button variant='light' leftIcon={<Tool />} onClick={() => setShowTools(!showTools)}>
            Crop Settings
          </Button>
        </Group>
        <Collapse in={showTools}>
          <Title order={3}>Crop settings</Title>
          <Group sx={{ alignItems: 'flex-start' }} spacing='xl'>
            <IncrementedNumberInput label='Split into' value={numberOfSplits} setValue={setNumberOfSplits} max={20} min={1} />

            <InputWrapper label='Preview lines' sx={{}}>
              <Checkbox size='xl' checked={showPreviewLines} onChange={event => setShowPreviewLines(event.currentTarget.checked)} />
            </InputWrapper>
            <InputWrapper label='Aspect ratio'>
              {desiredRatio === 'custom' ? (
                <Group spacing={5}>
                  <NumberInput
                    sx={{ maxWidth: 100 }}
                    value={customRatio.width}
                    required
                    icon={<ArrowsHorizontal />}
                    max={1000}
                    min={1}
                    onChange={val => setCustomRatio({ width: val ?? customRatio.width, height: customRatio.height })}
                  />
                  <NumberInput
                    sx={{ maxWidth: 100 }}
                    value={customRatio.height}
                    icon={<ArrowsVertical />}
                    max={1000}
                    min={1}
                    onChange={val => setCustomRatio({ height: val ?? customRatio.height, width: customRatio.width })}
                  />
                  <ActionIcon color={theme.primaryColor} variant='filled' size='lg' onClick={() => setDesiredRatio('free')}>
                    <X />
                  </ActionIcon>
                </Group>
              ) : (
                <Select value={desiredRatio} data={AspectRatios} onChange={val => setDesiredRatio(val ?? '')} />
              )}
            </InputWrapper>
          </Group>
        </Collapse>
      </Box>
      {loading ? (
        <Center sx={{ height: 600 }}>
          <Loader />
        </Center>
      ) : (
        imgSrc !== undefined && (
          <Center my='xl'>
            <ReactCrop
              renderSelectionAddon={() => (showPreviewLines ? <PreviewLines /> : null)}
              keepSelection
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
              onComplete={(pixelCrop, percentCrop) => setCompletedCrop(pixelCrop)}
              aspect={aspect}
              style={{ alignSelf: 'center', margin: 'auto' }}
            >
              <Image
                withPlaceholder={loading}
                imageProps={{ style: { maxHeight: 600 } }}
                imageRef={imgRef}
                src={imgSrc}
                radius='xs'
                alt='Your image'
                onLoad={() => setDesiredRatio('original')}
              />
            </ReactCrop>
          </Center>
        )
      )}
      <Group position='center'>
        <Button disabled={!completedCrop || true}>Preview (soon&trade;)</Button>
        <Button disabled={!completedCrop} onClick={handleSubmit}>
          Confirm split
        </Button>
      </Group>
      <canvas
        ref={canvasPreviewRef}
        // style={{
        //   maxWidth: completedCrop?.width,
        //   maxHeight: completedCrop?.height,
        // }}
      />
    </Container>
  );
};
