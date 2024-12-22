import React , {useContext}from 'react';
import { Box, makeStyles, SxProps } from '@mui/material';
import BubbleArrow from './BubbleArrow';
import {Button} from '@mui/material';
import { ApplyOperationContext } from '../utils/ApplyOperationContext';
import type { Message } from '../utils/MessageParser';
import type {DateTime as luxonDataTime} from "luxon"
import { DateTime } from 'luxon';

interface ChatBubbleProps {
    position: 'left' | 'right';
    children: React.ReactNode;
    message: Message;
}

function convertDateTimeToShortString(dateTime: luxonDataTime | null): string {
    if (!dateTime) 
        return "";
    const now = DateTime.now();
    const diff = now.diff(dateTime, ['days', 'hours', 'minutes']).toObject();

    if (diff.days === undefined) 
        return "";

    if (diff.days < 1 && dateTime.day === now.day) {
        return dateTime.toFormat('HH:mm');
    } else if (diff.days < 2 ) {
        return 'yeserday' ;
    } else if (diff.days < 3) {
        return '2 days ago';
    } else if (dateTime.weekNumber === now.weekNumber) {
        return 'this week';
    } else {
        return 'earlier';
    }
}

export default function ChatBubble({ position, children, message }: ChatBubbleProps) {
    const isLeft = position === 'left';
    const wrapperAppend = isLeft ? 'justify-start' : 'justify-end';
    const { excelTable, scatter, savedId } = message;

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

    let shortInfo = "";
    if (message.timestap)
        shortInfo = convertDateTimeToShortString(DateTime.fromISO(message.timestap));
    if (!message.savedId){
        if (position === 'left')
            shortInfo = shortInfo + ' (unsaved)';
        else
            shortInfo = "(unsaved)" + shortInfo;
    }

    const applyButton = (
        <Button onClick={() => {
            handleApply(message);
        }} className=' max-w-16 max-h-8'>Apply</Button>
    )

    const rightSidebar = (
        <Box className='flex flex-col justify-start' sx={{maxWidth: '20%'}}>
            {excelTable && isLeft && applyButton }
            {shortInfo.length > 0 && <Box className='text-xs mt-auto ml-1 mb-1'>{shortInfo}</Box>}
        </Box>
    )
    const leftSidebar = (
        <Box className='flex flex-col justify-start' sx={{maxWidth: '20%'}}>
            {excelTable && !isLeft && applyButton }
            {shortInfo.length > 0 && 
            <Box className='text-xs mt-auto mr-1 mb-1'>{shortInfo}</Box>}
        </Box>
    )

    return (
        <div className={'flex' + ' ' + wrapperAppend}>
            {isLeft && <BubbleArrow position="left" />}
            {!isLeft && leftSidebar }
            <Box sx={sx} className={'border p-3' + ' ' }>
                {children}
            </Box>
            {!isLeft && <BubbleArrow position="right" />}
            {isLeft && rightSidebar }
        </div>
  );
}