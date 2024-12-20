import React, {useState, useEffect, useRef} from 'react';
import { Box, Stack } from '@mui/material';
import MessageBox from './MessageBox';
import BoxHeader from './BoxHeader';
import InputField from './InputField';
import { testMessages } from '../utils/TestDatas';
import type { Message } from './MessageBox';

const serverURL = import.meta.env.VITE_SERVER_URL;

export default function App() {
  const [waitingResponse, setWaitingResponse] = useState(false);

  const [messages, setMessages] = useState(testMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);

  function handleSend(message: string) {
    // use arrow function to get the latest state
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
    setWaitingResponse(() => true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = { role: 'bot', content: '为时已晚，有机体 '};
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setWaitingResponse(() => false);
    }, 1000);
  }

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' , block: "end"});
    }
  }, [messages]);

  return (
    <Stack className='h-screen'>
      <BoxHeader waitingResponse={waitingResponse} />
      <Box className=' overflow-y-scroll flex-grow max-h-full'>
        <MessageBox messages={messages}/>
        <div ref={messageEndRef}></div>
      </Box>
      <InputField onSend={handleSend} waitingResponse={waitingResponse}/>
    </Stack>
  );
}