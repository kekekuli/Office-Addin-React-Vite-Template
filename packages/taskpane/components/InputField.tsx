import React, {useState} from 'react';
import {Box, TextField, Button} from '@mui/material';

interface InputFieldProps {
    onSend: (message: string) => void;  
}

export default function InputField({onSend}: InputFieldProps){
    const [inputValue, setInputValue] = useState<string>('');

    function handleSend(){
        onSend(inputValue);
        setInputValue('');
    }

    console.log("rerender input field");
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
                }}></TextField>
            <Button 
                className='h-full'
                onClick={handleSend}>
                Send</Button>
        </Box>
    )
}
