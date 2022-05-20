import { Container, Text } from '@mantine/core';
import 'react-image-crop/dist/ReactCrop.css';
import { FilePicker } from '../filepicker/FilePicker';
import useStyles from './Splitter.styles';

export const Splitter = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <FilePicker />
    </div>
  );
};
