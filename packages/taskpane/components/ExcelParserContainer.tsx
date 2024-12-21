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

function handleApply(message: Message) {
    if (!message.excelTable) {
        toast.error('No Excel Data Available', toastOptins);
        return;
    }

    if (message.sort || message.insert)
        replaceTableData(message.excelTable);
    else if (message.scatter)
        handleScatter(message.excelTable);
    else
        toast.error('No operation to apply', toastOptins);
}

function handleScatter(excelTable: ExcelTableData) {
    replaceTableData(excelTable).then(
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
                let series = seriesCollection.add("Sales and Temperature");
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

async function replaceTableData(excelTable: ExcelTableData) {
    await Excel.run(async (context) => {
        const table = context.workbook.tables.getItem(excelTable.tableName);
        const tableRange = table.getDataBodyRange();
        tableRange.clear(); // Clear existing data
        tableRange.load('rowCount,columnCount');
        await context.sync();

        const currentRowCount = tableRange.rowCount;
        const currentColumnCount = tableRange.columnCount;

        // Resize the table to fit the new data
        const newRowCount = excelTable.rows.length;
        const newColumnCount = excelTable.header.length;
        table.resize(table.getRange().getResizedRange(newRowCount - currentRowCount, newColumnCount - currentColumnCount));
        await context.sync();

        const headerRange = table.getHeaderRowRange();
        headerRange.values = [excelTable.header]; // Set new header

        const dataRange = table.getDataBodyRange(); 
        dataRange.values = excelTable.rows; // Set new data
        await context.sync();
    }).then(() => {
        toast.success('Table data replaced successfully', toastOptins);
    }).catch((error) => {
        console.error(error);
        toast.error('Error while replacing table data', toastOptins);
    });
}

export default function ExcelParserContainer({ excelTableData, children }: ExcelParserContainerProps) {

    return (
        <ApplyOperationContext.Provider value={(message) => handleApply(message)}>
            {children}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!excelTableData}
            >
            </Backdrop>
        </ApplyOperationContext.Provider>
    )
}
