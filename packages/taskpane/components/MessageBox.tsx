import React, { useState } from "react";
import { Box, Stack, SxProps } from "@mui/system";
import ExcelTable from "./ExcelTable";
import {testTableDatas} from "../utils/TestDatas";
import { Message } from "../utils/MessageParser";
import { toast } from 'react-toastify';


interface MessageBoxProps {
    messages: Message[];
}

export default function MessageBox({ messages }: MessageBoxProps) {
    
    const tableData = testTableDatas[0];

    const renderItems = messages.map((message, index) => {
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
                    sx={sx}>
                    {message.renderTable ? <ExcelTable tabelValues={tableData}></ExcelTable> : message.content}
                </Box>
            </div>
        )
    })

    return (
        <Stack spacing={2}>
            {renderItems}
        </Stack>
    )
}