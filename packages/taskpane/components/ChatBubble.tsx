import React from 'react';
import { Box, SxProps } from '@mui/material';
import BubbleArrow from './BubbleArrow';

interface ChatBubbleProps {
    position: 'left' | 'right';
    children: React.ReactNode;
    excelTable?: any; 
    scatter?: boolean;
}

export default function ChatBubble({ position, children, excelTable, scatter }: ChatBubbleProps) {
    const isLeft = position === 'left';
    const wrapperAppend = isLeft ? 'justify-start' : 'justify-end';

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

    return (
        <div className={'flex' + ' ' + wrapperAppend}>
            {isLeft && <BubbleArrow position="left" />}
            <Box sx={sx} className={'border p-3' + ' ' }>
                {children}
            </Box>
            {!isLeft && <BubbleArrow position="right" />}
        </div>
  );
}