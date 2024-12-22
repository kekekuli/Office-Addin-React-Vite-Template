import React, { useEffect, useRef } from "react";
import { Box, Stack, SxProps } from "@mui/system";
import ExcelTable from "./ExcelTable";
import { Message } from "../utils/MessageParser";
import ChatBubble from "./ChatBubble";

interface MessageListProps {
    messages: Message[];
}


export default function MessageBox({ messages }: MessageListProps) {

    // Handle auto scroll of message box
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageEndRef.current) {
            // The "block" property should be set to "end", while default value is "start" causing unexpected behavior
            messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: "end" });
        }
    }, [messages]);
    const renderItems = messages.map((message, index) => {
        let sortedTable;
        if (message.sort) {
            const salesIndex = message.excelTable!.header.indexOf("Sales");
            // Copy data but not reference
            const copiedRows = message.excelTable!.rows.map((row) => [...row]);
            copiedRows.sort((a, b) => b[salesIndex] - a[salesIndex]);

            sortedTable = {
                ...message.excelTable,
                rows: copiedRows
            };
        }
        
        // return the wrapper and contents
        return (
            <ChatBubble position={message.role === "user" ? "right" : "left"} key={index} message={message}>
                {message.insert && <Box>This will insert new column "Profits = Sales - Costs"</Box>}
                {message.excelTable ? <ExcelTable excelTable={message.sort ? sortedTable: message.excelTable!} scatter={message.scatter}></ExcelTable> : message.content}
            </ChatBubble>
        )
    })

    return (
        <>
            <Stack spacing={2}>
                {renderItems}
            </Stack>
            <div ref={messageEndRef}></div>
        </>
    )
}