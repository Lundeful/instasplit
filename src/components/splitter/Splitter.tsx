import 'react-image-crop/dist/ReactCrop.css';
import { Box, Button, Center, Collapse, Container, Group, Image, InputWrapper, Loader, NumberInput, Select, SelectItem, Title } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowBackUp, ArrowsHorizontal, ArrowsVertical, Tool } from 'tabler-icons-react';
import { RouteKeys } from '../../App';
import { IncrementedNumberInput } from '../formcomponents/IncrementedNumberInput';
import { useDidUpdate } from '@mantine/hooks';

export const Splitter = () => {
  // Route state
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Image and crop state
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({ width: 100, height: 50, x: 0, y: 25, unit: '%' });
  const [completedCrop, setCompletedCrop] = useState<PercentCrop>();
  const [aspect, setAspect] = useState<number | undefined>();

  // Crop tools state
  const [showTools, setShowTools] = useState(false);
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
      setAspect(customRatio.width / customRatio.height);
      return;
    }

    if (desiredRatio === 'original') {
      const width = imgRef.current?.width;
      const height = imgRef.current?.height;
      if (!width || !height) return;

      setAspect(width / height);
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
      setAspect(newRatio.aspect);
      return;
    }
  }, [desiredRatio]);

  useDidUpdate(() => {
    if (desiredRatio === 'free' || !aspect || !imgRef.current) return;

    const { width, height } = imgRef.current;

    // We prefer full width crop, so we adjust height based on aspect ratio and number of images
    const adjustedHeight = width / (aspect * numberOfSplits);

    // If height is taller than image then we scale the crop
    const multiplier = adjustedHeight > height ? height / adjustedHeight : 1;
    const scaledHeight = adjustedHeight * multiplier;
    const scaledWidth = width * multiplier;

    // Place crop in center
    const xCoordinate = multiplier < 1 ? (width - scaledWidth) / 2 : 0;
    const yCoordinate = multiplier < 1 ? 0 : (height - adjustedHeight) / 2;

    setCrop({ width: scaledWidth, height: scaledHeight, x: xCoordinate, y: yCoordinate, unit: 'px' });
  }, [aspect, numberOfSplits]);

  useDidUpdate(() => {
    if (desiredRatio === 'custom') {
      setAspect(customRatio.width / customRatio.height);
    }
  }, [customRatio]);

  useEffect(() => {
    // Return if to FilePicker state was not passed
    if (!location.state) {
      navigate(RouteKeys.Upload);
      return;
    }
    loadImageData();
  }, []);

  const loadImageData = () => {
    const file = location.state as File;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setLoading(false);
    });
    reader.readAsDataURL(file);
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
          <Group sx={{ alignItems: 'flex-end' }}>
            <IncrementedNumberInput label='Split into' value={numberOfSplits} setValue={setNumberOfSplits} max={20} min={1} />
            <InputWrapper label='Aspect ratio'>
              <Select value={desiredRatio} data={AspectRatios} onChange={val => setDesiredRatio(val ?? '')} />
              {desiredRatio === 'custom' && (
                <Group mt={5} spacing={5}>
                  <NumberInput
                    value={customRatio.width}
                    required
                    icon={<ArrowsHorizontal />}
                    max={1000}
                    min={1}
                    onChange={val => setCustomRatio({ width: val ?? customRatio.width, height: customRatio.height })}
                  />
                  <NumberInput
                    value={customRatio.height}
                    icon={<ArrowsVertical />}
                    max={1000}
                    min={1}
                    onChange={val => setCustomRatio({ height: val ?? customRatio.height, width: customRatio.width })}
                  />
                </Group>
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
              keepSelection
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(_, percentCrop) => setCompletedCrop(percentCrop)}
              aspect={aspect}
              style={{ alignSelf: 'center', margin: 'auto' }}
            >
              <Image withPlaceholder={loading} imageProps={{ style: { maxHeight: 600 } }} imageRef={imgRef} src={imgSrc} radius='xs' alt='Your image' />
            </ReactCrop>
          </Center>
        )
      )}
      <Group position='center'>
        <Button disabled={!completedCrop}>Preview</Button>
        <Button disabled={!completedCrop} onClick={() => console.log(completedCrop)}>
          Confirm
        </Button>
      </Group>
    </Container>
  );
};

interface AspectRatio extends SelectItem {
  aspect?: number;
}

const AspectRatios: AspectRatio[] = [
  {
    label: 'Free',
    value: 'free',
  },
  {
    label: 'Original image',
    value: 'original',
  },
  {
    label: '4 x 5 (Instagram-friendly)',
    value: '4x5',
    aspect: 4 / 5,
  },
  {
    label: '16 x 9 (Widescreen)',
    value: '16x9',
    aspect: 16 / 9,
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];
