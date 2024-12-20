import React, {useState, useEffect, useRef} from 'react';
import { Box, Stack } from '@mui/material';
import MessageBox from './MessageBox';
import BoxHeader from './BoxHeader';
import InputField from './InputField';
import { testMessages } from '../utils/TestDatas';
import type { Message } from '../utils/MessageParser';
import MessageParser from '../utils/MessageParser';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const [waitingResponse, setWaitingResponse] = useState(false);

  const [messages, setMessages] = useState(testMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);

  function handleSend(message: string) {
    const response = MessageParser(message);

    // use arrow function to get the latest state
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
    setWaitingResponse(() => true);

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, response]);
      setWaitingResponse(() => false);
    }, 1000);
  }

  useEffect(() => {
    if (messageEndRef.current) {
      // The "block" property should be set to "end", while default value is "start" causing unexpected behavior
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' , block: "end"});
    }
  }, [messages]);

  return (
    <Stack className='h-screen'>
      <BoxHeader waitingResponse={waitingResponse} />
      <Box className=' overflow-y-scroll flex-grow'>
        <MessageBox messages={messages} />
        <div ref={messageEndRef}></div>
      </Box>
      <InputField onSend={handleSend} waitingResponse={waitingResponse} />
      <ToastContainer />
    </Stack>
  );
}