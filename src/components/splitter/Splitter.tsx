import 'react-image-crop/dist/ReactCrop.css';
import { Box, Button, Checkbox, Collapse, Container, Group, Image, InputWrapper, NumberInput, Paper, Select, SelectItem, Title } from '@mantine/core';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowBackUp, ArrowsHorizontal, ArrowsVertical, Crop as CropIcon, Tool, Tools } from 'tabler-icons-react';
import { RouteKeys } from '../../App';
import { IncrementedNumberInput } from '../formcomponents/IncrementedNumberInput';
import useStyles from './Splitter.styles';

export const Splitter = () => {
  // Mantine hooks
  const { classes } = useStyles();

  // Route state
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Image and crop state
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>();

  // Crop tools state
  const [showTools, setShowTools] = useState(false);
  const [numberOfSplits, setNumberOfSplits] = useState(2);
  const [dropdownRatio, setDropdownRatio] = useState<string>('original');
  const [customRatio, setCustomRatio] = useState<{ width: number; height: number }>({ width: 1, height: 1 });

  useEffect(() => {
    // if (!dropdownRatio)
  }, [dropdownRatio]);

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
    setCrop(undefined); // Trigger crop preview re-render
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setLoading(false);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    setCrop({ width: width, height: height, x: width, y: height, unit: 'px' });
    setAspect(width / height);
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
          {/* <Paper shadow='xs' p='xl' withBorder> */}
            <Title order={3}>Crop settings</Title>
            <Group sx={{ alignItems: 'flex-end' }}>
              <IncrementedNumberInput label='Split into' value={numberOfSplits} setValue={setNumberOfSplits} max={20} min={1} />
              <InputWrapper label='Aspect ratio'>
                <Select value={dropdownRatio} data={AspectRatios} onChange={val => setDropdownRatio(val ?? '')} />
                {dropdownRatio === 'custom' && (
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
          {/* </Paper> */}
        </Collapse>
      </Box>
      {imgSrc !== undefined && (
        <Container>
          <ReactCrop
            style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
            crop={crop}
            onChange={crop => setCrop(crop)}
            onComplete={setCompletedCrop}
            aspect={aspect}
          >
            <Image ref={imgRef} src={imgSrc} onLoad={onImageLoad} radius='xs' fit='contain' height={500} />
          </ReactCrop>
        </Container>
      )}
    </Container>
  );
};

interface AspectRatio extends SelectItem {
  aspect?: number;
}

const AspectRatios: AspectRatio[] = [
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
