import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Backdrop } from '@mui/material';
import MessageBox from './MessageList';
import BoxHeader from './BoxHeader';
import InputField from './InputField';
import { testMessages } from '../utils/TestDatas';
import MessageParser from '../utils/MessageParser';
import { ToastContainer } from 'react-toastify';
import type { ExcelTableData } from './ExcelTable';
import ExcelParserContainer from './ExcelParserContainer';
import { parseExcelTableToJson, getExcelTableNames } from '../utils/ExcelParser';
import { toastOptins } from '../utils/ToastConfig';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';

export default function App() {
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messages, setMessages] = useState(testMessages);
  const [excelTableData, setExcelTableData] = useState<ExcelTableData | null>(null);

  // Use ref to check if the toast is already displayed when in strict mode
  const isDisplayedLoadStatus = useRef(false);

  // Handle user input
  function handleSend(message: string) {
    const response = MessageParser(message, excelTableData);
    const timestamp = DateTime.now().toISO();

    // use arrow function to get the latest state
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message, timestap: timestamp }]);
    setWaitingResponse(() => true);

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, response]);
      setWaitingResponse(() => false);
    }, 1000);
  }

  useEffect(() => {
    Office.onReady().then(() => {
      getExcelTableNames().then((tableNames) => {
        parseExcelTableToJson(tableNames[0]).then((excelTable) => {
          setExcelTableData(excelTable);
        }).then(() => {
          if (isDisplayedLoadStatus.current) return;
          toast.success('Excel data loaded successfully', toastOptins);
        }).catch((error) => {
          if (isDisplayedLoadStatus.current) return;
          console.error(error);
          toast.error('Can not read the table, reopen one that available', {
            ...toastOptins,
            position: 'top-center',
            autoClose: false,
            closeButton: false,
            hideProgressBar: true,
            draggable: false,
            theme: 'dark',
            closeOnClick: false,
          });
        }).finally(() => {
          // There is still a chance that the toast is displayed twice when entered race condition on StrictMode
          isDisplayedLoadStatus.current = true;
        })
      })
    });
  }, []);

  return (
    <ExcelParserContainer excelTableData={excelTableData} >
      <Stack className='h-screen'>
        <BoxHeader waitingResponse={waitingResponse} />
        <Box className=' overflow-y-scroll flex-grow'>
          <MessageBox messages={messages} />
        </Box>
        <InputField onSend={handleSend} waitingResponse={waitingResponse} />
      </Stack>
      <ToastContainer />
    </ExcelParserContainer>
  );
}