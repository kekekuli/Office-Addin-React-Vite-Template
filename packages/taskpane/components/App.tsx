import React, { useEffect } from 'react';
import {Stack,  Box} from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';

const serverURL = import.meta.env.VITE_SERVER_URL

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

async function run() {
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.format.fill.color = "yellow";
    range.load("address");

    await context.sync();
    console.log(`The range address was "${range.address}".`);
  });
}

async function selectTable(){
    try {
      await Excel.run(async (context) => {
        // Get the target table and load its data into a matrix
        const table = context.workbook.tables.getItemAt(0);
        const tableRange = table.getRange();
        tableRange.load('values');  
        await context.sync();
        const data = tableRange.values; 
        
        // Use the XLSX library to convert the matrix into a worksheet 
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        await axios.post(`${serverURL}/api/saveTableData`, jsonData);
      });
    } catch (error) {
      console.error('Error selecting table:', error);
    } 
}

export default function App() {
  useEffect(() => {
    // Ensure the Office.js library is loaded
    Office.onReady((info) => {
      if (info.host === Office.HostType.Excel) {
        console.log('Office.js is ready');
      }
    });
    selectTable();
  }, []);

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
      {renderItems()}
    </Stack>
  )
}