import { ActionIcon, Container, createStyles, Header as MantineHeader, Text, useMantineColorScheme } from '@mantine/core';
import { MoonStars, Sun } from 'tabler-icons-react';

const HEADER_HEIGHT = 60;

export const Header = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { classes, cx } = useStyles();

  return (
    <MantineHeader height={HEADER_HEIGHT}>
      <Container className={classes.header}>
        <span>Instasplit</span>
        <ActionIcon variant='outline' color={dark ? 'yellow' : 'blue'} onClick={() => toggleColorScheme()} title='Toggle color scheme'>
          {dark ? <Sun size={18} /> : <MoonStars size={18} />}
        </ActionIcon>
      </Container>
    </MantineHeader>
  );
};

const useStyles = createStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
}));
