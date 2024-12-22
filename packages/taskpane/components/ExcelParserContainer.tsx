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
    applyCallback: () => void;
}

// Provide data cached in message
function handleApply(message: Message) : Promise<void> {
    if (!message.excelTable) {
        toast.error('No Excel Data Available', toastOptins);
        return Promise.reject();
    }

    if (message.sort || message.insert)
        return replaceTableData(message.excelTable);
    else if (message.scatter)
        return handleScatter(message.excelTable);
    else
        toast.error('No operation to apply', toastOptins);
    return Promise.reject();
}

function handleScatter(excelTable: ExcelTableData) : Promise<void>{
    return replaceTableData(excelTable).then(
        async () => {
            await Excel.run(async (context) => {
                const salesIndex = excelTable.header.indexOf("Sales");
                const costsIndex = excelTable.header.indexOf("Costs");

                let table = context.workbook.tables.getItem(excelTable.tableName);
                table.load('worksheet');
                await context.sync();
                let sheet = table.worksheet;

                let dataRange = table.getDataBodyRange();
                let rangeX = dataRange.getColumn(salesIndex);
                let rangeY = dataRange.getColumn(costsIndex);
                rangeX.load('address');
                rangeY.load('address');
                await context.sync(); 
                let chart = sheet.charts.add(Excel.ChartType.xyscatter, dataRange, Excel.ChartSeriesBy.auto);

                // Clear existing series, be careful with the delete order of the series
                // you can't delte like this, it will cause an iterator error
                    // let seriesCollection = chart.series;
                    // seriesCollection.load('items');
                    // await context.sync();
                    // seriesCollection.items.forEach((series) => {
                    //     series.delete();
                    // });
                let v = chart.series.getCount();
                await context.sync();
                for (let i = v.value - 1; i >= 0; i--){
                    chart.series.getItemAt(i).delete();
                }
                await context.sync();

                let seriesCollection = chart.series;
                chart.title.text = 'Sales Vs Costs';
                let series = seriesCollection.add("Sales and Costs");
                series.setXAxisValues(rangeX);
                series.setValues(rangeY);
                await context.sync(); 
            })
        }
    ).catch((error) => {
        console.error(error);
        toast.error('Error while replacing table data', toastOptins);
    });
}

// Replace the table data with the provided data
async function replaceTableData(excelTable: ExcelTableData) {
    await Excel.run(async (context) => {
        const table = context.workbook.tables.getItem(excelTable.tableName);

        const headerRange = table.getHeaderRowRange();
        const rowsRange = table.getDataBodyRange();
        rowsRange.clear(); // Clear existing data
        rowsRange.load('rowCount,columnCount');
        await context.sync();

        const currentRowCount = rowsRange.rowCount;
        const currentColumnCount = rowsRange.columnCount;
        // Resize the table to fit the new data
        const newRowCount = excelTable.rows.length;
        const newColumnCount = excelTable.header.length;
        table.resize(table.getRange().getResizedRange(newRowCount - currentRowCount, newColumnCount - currentColumnCount));
        await context.sync();

        const afterResizedHeaderRange = table.getHeaderRowRange();
        // Can not clear the header before resizing the table
        headerRange.clear(); // Clear existing header
        afterResizedHeaderRange.values = [excelTable.header]; // Set new header
        const afterResizedRowsRange = table.getDataBodyRange(); 
        afterResizedRowsRange.values = excelTable.rows; // Set new data
        await context.sync();
    }).then(() => {
        toast.success('Table data replaced successfully', toastOptins);
    }).catch((error) => {
        console.error(error);
        toast.error('Error while replacing table data', toastOptins);
    });
}

export default function ExcelParserContainer({ excelTableData, children, applyCallback }: ExcelParserContainerProps) {
    return (
        <ApplyOperationContext.Provider value={(message) => {
            handleApply(message).then(applyCallback);
        }}>
            {children}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!excelTableData}
            >
            </Backdrop>
        </ApplyOperationContext.Provider>
    )
}
