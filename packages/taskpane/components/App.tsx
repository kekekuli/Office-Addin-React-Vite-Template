import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Backdrop } from '@mui/material';
import MessageBox from './MessageBox';
import BoxHeader from './BoxHeader';
import InputField from './InputField';
import { testMessages } from '../utils/TestDatas';
import MessageParser from '../utils/MessageParser';
import { ToastContainer } from 'react-toastify';
import type { ExcelTableData } from './ExcelTable';
import ExcelParserContainer from './ExcelParserContainer';

export default function App() {
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messages, setMessages] = useState(testMessages);
  const [excelTableData, setExcelTableData] = useState<ExcelTableData | null>(null);

  // Handle user input
  function handleSend(message: string) {
    const response = MessageParser(message, excelTableData);

    // use arrow function to get the latest state
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
    setWaitingResponse(() => true);

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, response]);
      setWaitingResponse(() => false);
    }, 1000);
  }

  return (
    <Stack className='h-screen'>
      <BoxHeader waitingResponse={waitingResponse} />
      <Box className=' overflow-y-scroll flex-grow'>
        <MessageBox messages={messages} />
      </Box>
      <InputField onSend={handleSend} waitingResponse={waitingResponse} />
      <ToastContainer />
      <ExcelParserContainer setExcelTableData={setExcelTableData} />      
    </Stack>
  );
}