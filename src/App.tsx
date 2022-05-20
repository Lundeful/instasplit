import './App.css';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { Hero } from './components/hero/Hero';
import { Route, Routes } from 'react-router-dom';
import { Splitter } from './components/splitter/Splitter';
import { useEffect } from 'react';
import { Picker } from './components/picker/Picker';
import { WithLayout } from './components/Layout';

// Primary color #f6416c
// Background color #1A1B1E

export enum RouteKeys {
  Home = '/',
  Upload = '/upload',
  Split = '/split',
}

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
      <MantineProvider theme={{ colorScheme, primaryColor: 'pink' }} withGlobalStyles withNormalizeCSS>
        <WithLayout>
          <Routes>
            <Route path={RouteKeys.Home} element={<Hero />} />
            <Route path={RouteKeys.Upload} element={<Picker />} />
            <Route path={RouteKeys.Split} element={<Splitter />} />
          </Routes>
        </WithLayout>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
