import React from "react";
import { Box, Stack, SxProps } from "@mui/system";
import ExcelTable from "./ExcelTable";
import testDatas from "../utils/TestDatas";


interface Message{
  role: "user" | "bot";
  content: string;
  renderTable?: boolean;
}

function getHistory() : Message[] {
  return [
    { role: "user", content: "aaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbcccccccccccccccccddddddddddddddd" },
    { role: "bot", content: "Hello,adfjakd;jfkasdjfklsdajkfldjsklfjkasldjfkasdjfklj User!" },
    { role: "bot", content: "", renderTable: true },
  ];
}

export default function MessageBox(){
    const tableData = testDatas[0];

    const history = getHistory();
    const renderItems = history.map((message, index) => {
        let wrapperAppend = message.role === "user" ? "justify-end" : "justify-start";
        let boxAppend = message.role === "user" ? "mr-3" : "ml-3";

        // Set the style of the box depending on the table or text
        let sx: SxProps = message.renderTable ? {
            width: "80%",
            height: "300px",
        } : {
            maxWidth: "60%",
            wordWrap: "break-word",
        }
        // return the wrapper and contents
        return (
            <div className={'flex' + ' ' + wrapperAppend} key={index}>
                <Box className={'border rounded-lg p-3' + ' ' + boxAppend}
                    sx={sx}
                >
                    {message.renderTable ? <ExcelTable tabelValues={tableData}></ExcelTable> : message.content}
                </Box>
            </div>
        )
    })

    return (
        <Stack spacing={2} sx={{ flexGrow: 1}}>
            {renderItems}
        </Stack>
    )
}