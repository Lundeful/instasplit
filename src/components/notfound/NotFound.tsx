import { Title, Text, Button, Container, Group } from '@mantine/core';
import useStyles from './NotFound.styles';
import { Link } from 'react-router-dom';
import { RouteKeys } from '../../App';

export const NotFound = () => {
  const { classes } = useStyles();

  return (
    <Container className={classes.container}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have wandered off track.</Title>
      <Text color='dimmed' size='lg' align='center' className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page could've been moved to another URL.
      </Text>
      <Group position='center'>
        <Button variant='subtle' size='md' component={Link} to={RouteKeys.Home}>
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
};
