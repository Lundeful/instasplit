import { Box } from '@mantine/core';
import { FC } from 'react';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';

export const WithLayout: FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <>
      <Header />
      <Box sx={{ minHeight: 600 }}>{children}</Box>
      <Footer />
    </>
  );
};
