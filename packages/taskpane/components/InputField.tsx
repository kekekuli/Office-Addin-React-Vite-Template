import React, {useState, useRef, useEffect} from 'react';
import {Box, TextField, Button} from '@mui/material';
import { toast, Bounce } from 'react-toastify';
import { toastOptins } from '../utils/ToastConfig';

interface InputFieldProps {
    waitingResponse: boolean;
    onSend: (message: string) => void;  
}

export default function InputField({onSend, waitingResponse}: InputFieldProps){
    const [inputValue, setInputValue] = useState<string>('');

    function handleSend(){
        if (inputValue === ''){
            toast.error('Can not be empty', toastOptins);
            return;
        }
        onSend(inputValue);
        setInputValue('');
    }

    return (
        <Box className="h-fit flex m-2">
            <TextField 
                size='small' 
                className=' flex-grow' 
                placeholder='Input something' 
                value={inputValue} 
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                onKeyDown={(e) => {
                    if(e.key === 'Enter')
                        handleSend();
                }}
                disabled={waitingResponse}
                inputRef={(input) => {input && input.focus();}}
                ></TextField>
            <Button 
                className='h-full'
                onClick={handleSend}
                disabled={waitingResponse}>
                Send</Button>
        </Box>
    )
}
