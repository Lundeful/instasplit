import { Container, Text } from '@mantine/core';
import 'react-image-crop/dist/ReactCrop.css';
import useStyles from './Splitter.styles';

export const Splitter = () => {
  const { classes } = useStyles();
  return (
    <Container className={classes.container}>
      <Text align='center'>Here comes the splitter</Text>
    </Container>
  );
};
