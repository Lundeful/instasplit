import './App.css';
import { ColorScheme, ColorSchemeProvider, Container, MantineProvider, Text, Title } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { Header } from './layout/Header';
import { Welcome } from './components/welcome/Welcome';

// Primary color #f6416c

function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Header />
        <Welcome />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
