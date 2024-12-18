import React from 'react';
import {Stack,  Box} from '@mui/material';

interface Message{
  role: "user" | "bot";
  content: string;
}

function getHistory() : Message[] {
  return [
    { role: "user", content: "aaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbcccccccccccccccccddddddddddddddd" },
    { role: "bot", content: "Hello,adfjakd;jfkasdjfklsdajkfldjsklfjkasldjfkasdjfklj User!" }
  ];
}

export default function App() {
  const renderItems = () => {
    const history = getHistory();
    return history.map((message, index) => {
      let wrapperAppend = message.role === "user" ? "justify-end" : "justify-start";
      let boxAppend = message.role === "user" ? "mr-3" : "ml-3";
      return (
        <div className={'flex' + ' ' + wrapperAppend} key={index}>
          <Box className={'border rounded-lg p-3' + ' ' + boxAppend}
            sx={{
              maxWidth: "60%",
              wordWrap: "break-word",
            }}
          >
            {message.content}
          </Box>
        </div>
      )
    })
  }

  return (
    <Stack spacing={2}>
      {
        renderItems()
      }
    </Stack>
  )
}