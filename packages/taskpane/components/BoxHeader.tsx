import React from 'react';
import {Button} from '@mui/material';
import { CircularProgress } from '@mui/material';

interface BoxHeaderProps {
    waitingResponse: boolean;
    onClear: () => void;
}

export default function BoxHeader({ waitingResponse, onClear }: BoxHeaderProps) {
    return (
        <div className='bg-blue-500 min-h-12 flex items-center justify-between text-white px-4'>
            <div className='flex-1 flex items-center justify-center'>
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
            <div className=' absolute right-4'>
                <Button variant='contained' color='secondary' className='max-w-6' sx={{
                    fontSize: "10px"
                }} onClick={onClear}>Clear</Button>
            </div>
        </div>
    );
}