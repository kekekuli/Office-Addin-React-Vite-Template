// Set up Ag-Grid features
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, FirstDataRenderedEvent, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface ExcelTableProps {
    tabelValues: any[];
}

export default function ExcelTable({ tabelValues }: ExcelTableProps) {
    const getColumnDefs = () => {
        return tabelValues[0] ?
            tabelValues[0].map((header: string) => {
                return { headerName: header, field: header };
            })
            : [];
    }

    const getRowData = () => {
        const rows = tabelValues.slice(1);
        return rows.map((row) => {
            const rowData = {};
            tabelValues[0].forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });
    }

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