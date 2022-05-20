import { Title, Text, Container } from '@mantine/core';
import useStyles from './Welcome.styles';

export const Welcome = () => {
  const { classes } = useStyles();

  return (
    <Container>
      <Title className={classes.title} align='center' mt={50}>
        Welcome to{' '}
        <Text inherit variant='gradient' component='span' gradient={{ from: '#f6416c', to: '#f86789' }}>
          InstaSplit
        </Text>
      </Title>
      <Text color='dimmed' align='center' size='lg' sx={{ maxWidth: 580 }} mx='auto' mt='xl'>
        Coming soon&trade;
      </Text>
    </Container>
  );
};
