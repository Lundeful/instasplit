import './App.css';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { Header } from './components/header/Header';
import { HeroTitle } from './components/hero/Hero';
import { Route, Routes } from 'react-router-dom';
import { Splitter } from './components/splitter/Splitter';

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
        <Routes>
          <Route path='/' element={<HeroTitle />} />
          <Route path='/split' element={<Splitter />} />
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
