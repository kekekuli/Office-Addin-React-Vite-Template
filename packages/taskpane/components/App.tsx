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
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <MessageBox />
      </Box>
      <InputField />
    </Stack>
  );
}