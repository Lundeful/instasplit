import { Container, Text, Button, Group, useMantineTheme, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import useStyles from './Hero.styles';

export function HeroTitle() {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Use{' '}
          <Text component='span' variant='gradient' gradient={{ from: '#f6416c', to: '#f86789' }} inherit>
            InstaSplit
          </Text>{' '}
          to show off your work in a whole new way.
        </h1>

        <Text className={classes.description} color='dimmed'>
          Split one image into multiple images with a perfect seam to create those amazing panoramas on Instagram.
        </Text>

        <div className={classes.controls}>
          <Button component={Link} to='/split' size='xl' className={classes.control} variant='gradient' gradient={{ from: '#f6416c', to: '#f86789' }}>
            Start splitting
          </Button>

          <Button
            component='a'
            // href='https://github.com/lundeful/instasplit'
            size='xl'
            variant='outline'
            className={cx(classes.control, classes.githubControl)}
            color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
            disabled={true}
          >
            GitHub
          </Button>
        </div>
      </Container>
    </div>
  );
}
