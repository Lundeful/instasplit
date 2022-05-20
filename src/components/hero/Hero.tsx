import { createStyles, Container, Text, Button, Group, useMantineTheme, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    position: 'relative',
    paddingTop: 100,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },

  githubControl: {
    borderWidth: 2,
    borderColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.dark[9],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : 'transparent',

    '&:hover': {
      backgroundColor: `${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]} !important`,
    },
  },
}));

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

        <Group className={classes.controls}>
          <Anchor component={Link} to='/split'>
            <Button size='xl' className={classes.control} variant='gradient' gradient={{ from: '#f6416c', to: '#f86789' }}>
              Start splitting
            </Button>
          </Anchor>

          <Button
            component='a'
            // href='https://github.com/lundeful/instasplit'
            size='xl'
            variant='outline'
            className={cx(classes.control, classes.githubControl)}
            color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
            disabled={true}
          >
            GitHub (coming soon&trade;)
          </Button>
        </Group>
      </Container>
    </div>
  );
}
