import React from 'react';
import { CircularProgress } from '@mui/material';

interface BoxHeaderProps {
    waitingResponse: boolean;
}

export default function BoxHeader({ waitingResponse }: BoxHeaderProps) {
    return (
        <div className='bg-blue-500 h-24 flex items-center justify-center text-white'>
            {
                waitingResponse ? (
                    <div className='flex items-center'>
                        <CircularProgress color="inherit" size={24} />
                        <p className='ml-2'>Waiting for response...</p>
                    </div>
                ) : (
                    <p>Chat with the bot</p>
                )
            }
        </div>
    );
}