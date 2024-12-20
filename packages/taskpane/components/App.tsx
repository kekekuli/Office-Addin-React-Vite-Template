import React, {useState, useEffect, useRef} from 'react';
import { Box, Stack } from '@mui/material';
import MessageBox from './MessageBox';
import BoxHeader from './BoxHeader';
import InputField from './InputField';
import { testMessages } from '../utils/TestDatas';
import type { Message } from './MessageBox';

const serverURL = import.meta.env.VITE_SERVER_URL;

export default function App() {
  const [messages, setMessages] = useState(testMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);

  function handleSend(message: string) {
    const newMessages: Message[] = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);
  }

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' , block: "end"});
    }
  }, [messages]);

  return (
    <Stack className='h-screen'>
      <BoxHeader />
      <Box className=' overflow-y-scroll flex-grow max-h-full'>
        <MessageBox messages={messages}/>
        <div ref={messageEndRef}></div>
      </Box>
      <InputField onSend={handleSend}/>
    </Stack>
  );
}