import React from 'react';
import { Box, Stack } from '@mui/material';
import MessageBox from './MessageBox';
import BoxHeader from './BoxHeader';
import InputField from './InputField';

const serverURL = import.meta.env.VITE_SERVER_URL;

export default function App() {
  return (
    <Stack sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BoxHeader />
      <MessageBox />
      <InputField />
    </Stack>
  );
}