// Set up Ag-Grid features
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, FirstDataRenderedEvent, ModuleRegistry } from 'ag-grid-community';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ExcelTableProps {
    excelTable: ExcelTableData;
    scatter?: boolean;
}
export interface ExcelTableData {
    tableName: string;
    header: any[];
    rows: any[];
}

function generateScatterOptions(excelTable: ExcelTableData): AgChartOptions {
    const scatterData = excelTable.rows.map((row) => ({
        Sales: row[excelTable.header.indexOf('Sales')],
        Costs: row[excelTable.header.indexOf('Costs')],
    }));

    const scatterOptions: AgChartOptions = {
        title: {
            text: 'Sales vs Costs'
        },
        subtitle: {
            text: 'Scatter Plot'
        },
        series: [{
            type: 'scatter',
            xKey: 'Sales',
            yKey: 'Costs',
            data: scatterData
        }],
        axes: [
            {
                type: 'number',
                position: 'bottom',
                title: {
                    text: 'Sales'
                },
            },
            {
                type: 'number',
                position: 'left',
                title: {
                    text: 'Costs'
                }
            }
        ]

    }
    return scatterOptions;
}
export default function ExcelTable({ excelTable, scatter }: ExcelTableProps) {
    const getColumnDefs = () => {
        return excelTable.header.map((header: string) => {
            return { headerName: header, field: header };
        })
    }

    const getRowData = () => {
        return excelTable.rows.map((row) => {
            const rowData = {};
            excelTable.header.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });
    }

    // Render scatter plot if scatter is true
    if (scatter) {
        return (
            <AgCharts options={generateScatterOptions(excelTable)} />
        )
    }
    else {
        return (
            <AgGridReact
                columnDefs={getColumnDefs()}
                rowData={getRowData()}
                onFirstDataRendered={(e: FirstDataRenderedEvent) => {
                    e.api.autoSizeAllColumns();
                }}
                suppressColumnVirtualisation={true}
            >
            </AgGridReact>
        )
    }

}