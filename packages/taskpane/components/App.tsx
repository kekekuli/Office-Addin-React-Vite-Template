import React, {useState, useEffect, useRef} from 'react';
import { Box, Stack, Backdrop } from '@mui/material';
import MessageBox from './MessageBox';
import BoxHeader from './BoxHeader';
import InputField from './InputField';
import { testMessages } from '../utils/TestDatas';
import MessageParser from '../utils/MessageParser';
import { ToastContainer, toast } from 'react-toastify';
import { parseExcelTableToJson, getExcelTableNames } from '../utils/ExcelParser';
import { toastOptins } from '../utils/ToastConfig';
import type { ExcelTableData } from './ExcelTable';

export default function App() {
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messages, setMessages] = useState(testMessages);
  const [excelTableData, setExcelTableData] = useState<ExcelTableData | null>(null);
  const [readable, setReadable] = useState(true);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const backDropOpen = !readable;

  // Handle fisrt time loads and parse excel tables
  useEffect(() => {
    Office.onReady(() => {
      getExcelTableNames().then((tableNames) => {
        parseExcelTableToJson(tableNames[0]).then((excelTable) => {
          setExcelTableData(excelTable);
        }).catch(() => {
          setReadable(false);
        })
      })
    });
  }, []);

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

  // Handle auto scroll of message box
  useEffect(() => {
    if (messageEndRef.current) {
      // The "block" property should be set to "end", while default value is "start" causing unexpected behavior
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' , block: "end"});
    }
  }, [messages]);

  // Handle notifying excel tables read result
  useEffect(() => {
    if (!readable){
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
    }
    else{
      toast.success('Tables Finded', toastOptins);
    }
  }, [readable])

  return (
    <Stack className='h-screen'>
      <BoxHeader waitingResponse={waitingResponse} />
      <Box className=' overflow-y-scroll flex-grow'>
        <MessageBox messages={messages} />
        <div ref={messageEndRef}></div>
      </Box>
      <InputField onSend={handleSend} waitingResponse={waitingResponse} />
      <ToastContainer />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backDropOpen}
      >
      </Backdrop>
    </Stack>
  );
}