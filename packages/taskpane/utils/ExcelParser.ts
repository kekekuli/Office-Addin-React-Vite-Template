import * as XLSX from 'xlsx';

export async function parseExcelTableToJson(tableName: string): Promise<any[]> {
  return await Excel.run(async (context) => {
    const table = context.workbook.tables.getItem(tableName);
    const tableRange = table.getRange();
    tableRange.load('values');
    await context.sync();
    const data = tableRange.values;
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const targetTableInJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return targetTableInJson;
  });
}
export async function getExcelTableNames(): Promise<string[]> {
  return await Excel.run(async (context) => {
    const tables = context.workbook.tables;
    tables.load('items');
    await context.sync();
    return tables.items.map((table) => table.name);
  });
}
