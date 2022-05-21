import { Container, Text, Button, useMantineTheme, Alert } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RouteKeys } from '../../App';
import useStyles from './Hero.styles';

export function Hero() {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const [showAlert, setShowAlert] = useState(true);

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

        {showAlert && (
          <Alert my='sm' title='Take note!' color='orange' withCloseButton onClose={() => setShowAlert(false)}>
            <Text>This app is still early in development. Feel free to try it out, but expect unfinished functionality and bugs</Text>
          </Alert>
        )}

        <div className={classes.controls}>
          <>
            <Button
              component={Link}
              to={RouteKeys.Upload}
              size='xl'
              className={classes.control}
              variant='gradient'
              gradient={{ from: '#f6416c', to: '#f86789' }}
            >
              Start splitting
            </Button>

            <Button
              component={Link}
              to='/howto'
              size='xl'
              variant='outline'
              className={cx(classes.control, classes.howToControl)}
              color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
              disabled={true}
            >
              How to use (soon&trade;)
            </Button>
            {/* <Button
              component='a'
              // href='https://github.com/lundeful/instasplit'
              href='https://github.com/lundeful'
              size='xl'
              variant='outline'
              className={cx(classes.control, classes.githubControl)}
              color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
              disabled={true}
            >
              GitHub (soon&trade;)
            </Button> */}
          </>
        </div>
      </Container>
    </div>
  );
}
