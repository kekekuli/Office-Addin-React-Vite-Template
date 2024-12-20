import React from 'react';
import {Box, TextField, Button} from '@mui/material';

export default function InputField() {
    return (
        <Box className="h-fit flex">
            <TextField size='small' className=' flex-grow'></TextField>
            <Button className='h-full'>Send</Button>
        </Box>
    )
}
