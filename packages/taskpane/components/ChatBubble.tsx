import React , {useContext}from 'react';
import { Box, SxProps } from '@mui/material';
import BubbleArrow from './BubbleArrow';
import {Button} from '@mui/material';
import { ApplyOperationContext } from '../utils/ApplyOperationContext';
import type { Message } from '../utils/MessageParser';

interface ChatBubbleProps {
    position: 'left' | 'right';
    children: React.ReactNode;
    message: Message;
}

export default function ChatBubble({ position, children, message }: ChatBubbleProps) {
    const isLeft = position === 'left';
    const wrapperAppend = isLeft ? 'justify-start' : 'justify-end';
    const { excelTable, scatter } = message;

    const handleApply = useContext(ApplyOperationContext);

    // Set the style of the box depending on the table or text
    let sx: SxProps = excelTable ? {
        width: "80%",
        height: "300px",
    } : {
        maxWidth: "60%",
        wordWrap: "break-word",
    }
    if (scatter)
        sx.height = "fit-content";

    // common things for sx
    sx.position = 'relative';
    sx.backgroundColor = "#e5e7eb";
    sx.borderRadius = isLeft ? "0 10px 10px 10px" : "10px 0 10px 10px"; 
    sx.boxShadow = isLeft ? "2px 2px 5px rgba(0, 0, 0, 0.1)" : "-2px 2px 5px rgba(0, 0, 0, 0.1)";

    const applyButton = (
        <Button onClick={() => {
            handleApply(message);
        }} className=' max-w-16 max-h-8'>Apply</Button>
    )

    return (
        <div className={'flex' + ' ' + wrapperAppend}>
            {isLeft && <BubbleArrow position="left" />}
            {excelTable && !isLeft && applyButton }
            <Box sx={sx} className={'border p-3' + ' ' }>
                {children}
            </Box>
            {!isLeft && <BubbleArrow position="right" />}
            {excelTable && isLeft && applyButton }
        </div>
  );
}