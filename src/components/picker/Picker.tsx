import { Container, Group, MantineTheme, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useNavigate } from 'react-router-dom';
import { Icon, Photo, Upload, X } from 'tabler-icons-react';
import { RouteKeys } from '../../App';

const IMAGE_SIZE_IN_MB = 30;

export const Picker = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleFileSelected = async (files: File[]) => {
    if (files && files.length > 0) navigate(RouteKeys.Split, { state: files[0] });
  };

  return (
    <Container mt={50}>
      <Dropzone
        onDrop={handleFileSelected}
        onReject={files => console.log('rejected files', files)}
        maxSize={IMAGE_SIZE_IN_MB * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
      >
        {status => dropZoneContent(status, theme)}
      </Dropzone>
    </Container>
  );
};

const dropZoneContent = (status: DropzoneStatus, theme: MantineTheme) => {
  return (
    <Group position='center' spacing='xl' style={{ minHeight: 220, pointerEvents: 'none' }}>
      <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />

      <div>
        <Text size='xl' inline align='center'>
          Drag image or click to upload
        </Text>
        <Text size='sm' color='dimmed' inline mt={7} align='center'>
          File size should not exceed {IMAGE_SIZE_IN_MB} MB.
        </Text>
      </div>
    </Group>
  );
};

const ImageUploadIcon = ({ status, ...props }: React.ComponentProps<Icon> & { status: DropzoneStatus }) => {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
};

const getIconColor = (status: DropzoneStatus, theme: MantineTheme) =>
  status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
