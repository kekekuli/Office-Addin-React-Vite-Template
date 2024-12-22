import React from 'react';
import {Button} from '@mui/material';
import { CircularProgress, Backdrop } from '@mui/material';

interface BoxHeaderProps {
    waitingResponse: boolean;
    onClear: () => void;
}

export default function BoxHeader({ waitingResponse, onClear }: BoxHeaderProps) {
    const [openBackdrop, setOpenBackdrop] = React.useState(false);

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
                }} onClick={() => {setOpenBackdrop(true)}}>Clear</Button>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={() => setOpenBackdrop(false)}
            >
                Are you sure to clear all messages?
                <Button onClick={() => {
                    setOpenBackdrop(false);
                    onClear();
                }}
                variant='contained'
                color="error"
                sx={{
                    marginLeft: "4px"
                }}>
                    Yes
                </Button>
            </Backdrop>

        </div>
    );
}