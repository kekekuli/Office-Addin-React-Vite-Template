import { parseExcelTableToJson, getExcelTableNames } from '../utils/ExcelParser';
import type { ExcelTableData } from './ExcelTable';
import React, { useEffect, useState } from 'react';
import { Backdrop } from '@mui/material';
import { toastOptins } from '../utils/ToastConfig';
import { toast } from 'react-toastify';

interface ExcelParserContainerProps {
    setExcelTableData: React.Dispatch<React.SetStateAction<ExcelTableData | null>>;
}

export default function ExcelParserContainer({ setExcelTableData }: ExcelParserContainerProps) {
    const [readable, setReadable] = useState(true);
    const backDropOpen = !readable;

    // Handle fisrt time loads and parse excel tables
    useEffect(() => {
        Office.onReady(() => {
            getExcelTableNames().then((tableNames) => {
                parseExcelTableToJson(tableNames[0]).then((excelTable) => {
                    setExcelTableData(excelTable);
                }).catch(() => {
                    setReadable(false);
                })
            })
        });
    }, []);

    // Handle notifying excel tables read result
    useEffect(() => {
        if (!readable) {
            toast.error('Can not read the table, reopen one that available', {
                ...toastOptins,
                position: 'top-center',
                autoClose: false,
                closeButton: false,
                hideProgressBar: true,
                draggable: false,
                theme: 'dark',
                closeOnClick: false,
            });
        }
        else {
            toast.success('Tables Finded', toastOptins);
        }
    }, [readable])

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={backDropOpen}
        >
        </Backdrop>
    )
}
