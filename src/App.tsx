import './App.css';
import { ColorScheme, ColorSchemeProvider, Container, MantineProvider, Text, Title } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { Header } from './layout/Header';
import { Welcome } from './components/welcome/Welcome';
import { useEffect } from 'react';

// Primary color #f6416c
// Background color #1A1B1E

function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.querySelector("meta[name='theme-color']")?.setAttribute('content', colorScheme === 'dark' ? '#1A1B1E' : '#fff');
  }, [colorScheme]);

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
