// Set up Ag-Grid features
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, FirstDataRenderedEvent, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface ExcelTableProps {
    excelTable: ExcelTableData;
}
export interface ExcelTableData {
  tableName: string;
  header: any[];
  rows: any[];
}

export default function ExcelTable({ excelTable }: ExcelTableProps) {
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