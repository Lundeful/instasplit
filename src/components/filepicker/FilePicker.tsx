import { Container, Group, MantineTheme, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useEffect, useState } from 'react';
import { Icon, Photo, Upload, X } from 'tabler-icons-react';

export const FilePicker = () => {
  const theme = useMantineTheme();
  const [selectedFile, setSelectedFile] = useState<File>();

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  return (
    <Container>
      <Dropzone
        onDrop={files => setSelectedFile(files[0])}
        onReject={files => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
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
        <Text size='xl' inline>
          Drag image here or click to select file
        </Text>
        {/* <Text size='sm' color='dimmed' inline mt={7}>
          Attach as many files as you like, each file should not exceed 5mb
        </Text> */}
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
