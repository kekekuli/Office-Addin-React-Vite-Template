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
        let wrapperAppend = message.role === "user" ? "justify-end" : "justify-start";
        let boxAppend = message.role === "user" ? "mr-3" : "ml-3";

        // Set the style of the box depending on the table or text
        let sx: SxProps = message.excelTable ? {
            width: "80%",
            height: "300px",
        } : {
            maxWidth: "60%",
            wordWrap: "break-word",
        }
        if (message.scatter)
            sx.height = "fit-content";

        // return the wrapper and contents
        return (
            <ChatBubble position={message.role === "user" ? "right" : "left"} key={index} excelTable={message.excelTable} scatter={message.scatter}>
                {message.excelTable ? <ExcelTable excelTable={message.excelTable!} scatter={message.scatter}></ExcelTable> : message.content}
            </ChatBubble>
        )
    })

    return (
        <>
            <Stack spacing={2}>
                {renderItems}
                {/* <ChatBubble position="left">Hello</ChatBubble> */}
            </Stack>
            <div ref={messageEndRef}></div>
        </>
    )
}