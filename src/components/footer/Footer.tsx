import { Anchor, Container, createStyles, Group, Image, Text } from '@mantine/core';
import Logo from '../../assets/instasplit-logo.svg';

export const Footer = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Image src={Logo} height={30} width={30} />
        {/* <Group className={classes.links}>{items}</Group> */}
        <Group className={classes.links}>
          <Anchor href='https://www.christofferlund.com' target='_blank'>
            <Text>Made by Christoffer Lund</Text>
          </Anchor>
        </Group>
      </Container>
    </div>
  );
};

const useStyles = createStyles(theme => ({
  footer: {
    marginTop: 240,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));
