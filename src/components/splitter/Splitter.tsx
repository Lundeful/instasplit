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
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowBackUp, ArrowsHorizontal, ArrowsVertical, Tool, X } from 'tabler-icons-react';
import { RouteKeys } from '../../App';
import { IncrementedNumberInput } from '../formcomponents/IncrementedNumberInput';
import { useDidUpdate } from '@mantine/hooks';
import { AspectRatios } from './types';
import { downloadFile } from '../../utilities/downloadFile';
import { getCrop } from '../../utilities/getCrop';
import { getAspectRatio } from '../../utilities/getAspectRatio';
import { getCroppedImages } from '../../utilities/getCroppedImage';
import { PreviewLines } from './PreviewLines';

export const Splitter = () => {
  const theme = useMantineTheme();

  // Route state
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Image and crop state
  const imgRef = useRef<HTMLImageElement>(null);
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
    setAspect(getAspectRatio(desiredRatio, numberOfSplits, customRatio, imgRef.current?.width, imgRef.current?.height));
  }, [desiredRatio, numberOfSplits, customRatio]);

  useDidUpdate(() => {
    if (desiredRatio === 'free' || !aspect || !imgRef.current) return;
    const { width, height } = imgRef.current;
    const crop = getCrop(width, height, aspect);
    setCrop(crop);
    setCompletedCrop(crop);
  }, [aspect]);

  const loadImageData = useCallback(() => {
    // If state was not passed then we GTFO
    if (!location.state) {
      navigate(RouteKeys.Upload);
    }
    const file = location.state as File;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setLoading(false);
    });

    reader.readAsDataURL(file);
  }, [location.state, navigate]);

  useEffect(loadImageData, [loadImageData]);

  const handleSubmit = () => {
    if (!completedCrop || !imgRef.current) {
      // Todo: Display error message to user
      console.error('Missing image reference or completed crop');
      return;
    }

    try {
      const file = location.state as File;
      const originalFileName = file.name.split('.');
      originalFileName.pop();
      const images = getCroppedImages(imgRef.current, numberOfSplits, completedCrop as PixelCrop, file.type);
      images.forEach((image, i) => downloadFile(image, `${originalFileName}_${i + 1}`));
    } catch (e) {
      console.error(e);
      // TODO: Display error message to user
    }
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
                  <ActionIcon children={<X />} color={theme.primaryColor} variant='filled' size='lg' onClick={() => setDesiredRatio('free')} />
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
              renderSelectionAddon={() => (showPreviewLines ? <PreviewLines numberOfSplits={numberOfSplits} /> : null)}
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
    </Container>
  );
};
