import { ActionIcon, Anchor, Container, createStyles, Header as MantineHeader, Image, Text, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { MoonStars, Sun } from 'tabler-icons-react';
import Logo from '../assets/instasplit-logo.svg';

const HEADER_HEIGHT = 60;

export const Header = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { classes, cx } = useStyles();

  return (
    <MantineHeader height={HEADER_HEIGHT}>
      <Container className={classes.header}>
        <Anchor component={Link} to='/'>
          <Image src={Logo} height={30} width={30} />
        </Anchor>
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
