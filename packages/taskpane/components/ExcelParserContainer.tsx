import type { ExcelTableData } from './ExcelTable';
import React, { useEffect, useRef, useState } from 'react';
import { Backdrop } from '@mui/material';
import { toastOptins } from '../utils/ToastConfig';
import { toast } from 'react-toastify';
import { ApplyOperationContext } from '../utils/ApplyOperationContext';
import type { Message } from '../utils/MessageParser';

interface ExcelParserContainerProps {
    excelTableData: ExcelTableData | null;
    children?: React.ReactNode;
}

function handleApply(message: Message, originExcelData: ExcelTableData | null) {
    if (!originExcelData) {
        toast.error('No Excel Data Available', toastOptins);
        return;
    }
    const targetTableName = originExcelData.tableName;

    if (message.sort)
        handleSort(targetTableName);
    else if (message.scatter)
        handleScatter(targetTableName);
    else if (message.insert)
        handleInsert(targetTableName);
    else
        toast.error('No operation to apply', toastOptins);
}

function handleSort(targetTableName: string) {
    Excel.run(async (context) => {
        const table = context.workbook.tables.getItem(targetTableName);
        const salesColumn = table.columns.getItem('Sales');
        salesColumn.load('index');
        await context.sync();

        const salesColumnIndex = salesColumn.index;
        table.sort.apply([{ key: salesColumnIndex, ascending: true }]); // Replace 0 with the correct column index for 'Sales'
        await context.sync();
    }).then(() => {
        toast.success('Sort operation applied successfully', toastOptins);
    }).catch((error) => {
        console.error(error);
        toast.error('Error while applying the operation', toastOptins);
    });
}

function handleInsert(targetTableName: string) {
}

function handleScatter(targetTableName: string) {
}

export default function ExcelParserContainer({ excelTableData, children }: ExcelParserContainerProps) {

    return (
        <ApplyOperationContext.Provider value={(message) => handleApply(message, excelTableData)}>
            {children}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!excelTableData}
            >
            </Backdrop>
        </ApplyOperationContext.Provider>
    )
}
