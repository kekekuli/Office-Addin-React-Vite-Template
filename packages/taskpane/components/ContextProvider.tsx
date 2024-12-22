import React  from 'react';
import { ApplyOperationContext } from '../utils/ApplyOperationContext';
import { handleApply } from '../utils/ExcelParser';

interface ContextProviderProps {
    children?: React.ReactNode;
    applyCallback: () => void;
}

export default function ContextProvider({ children, applyCallback }: ContextProviderProps) {
    return (
        <ApplyOperationContext.Provider value={(message) => {
            handleApply(message).then(applyCallback);
        }}>
            {children}
        </ApplyOperationContext.Provider>
    )
}
