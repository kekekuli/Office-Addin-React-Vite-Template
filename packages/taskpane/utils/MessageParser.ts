import type { ExcelTableData } from "../components/ExcelTable";
export interface Message{
  role: "user" | "bot";
  content: string;
  excelTable?: ExcelTableData;
}

export default function MessageParser(message : string, excelTable : ExcelTableData | null) : Message{
  switch (message) {
    case "Sort the table by sales in descending order":
      return handleSort(excelTable);
    case "Create a scatter plot of sales and costs":
      return {role: "bot", content: "You want scatter"};
    case "Insert a column of profits":
      return handleInsert(excelTable);
    case "kekekuli":
      return {role: "bot", content: "为时已晚，有机体!"};
    default:
      return {role: "bot", content: "No support for this command"};
  }
}

function handleSort(excelTable: ExcelTableData | null) : Message{
  if (!excelTable)
    return {role: "bot", content: "No table to sort"};

  const salesIndex = excelTable.header.indexOf("Sales");
  // Copy data but not reference
  const copiedRows = excelTable.rows.map((row) => [...row]);
  copiedRows.sort((a, b) => b[salesIndex] - a[salesIndex]);

  const sortedTable = {
    ...excelTable,
    rows: copiedRows
  };

  return { role: "bot", content: "Sorted table", excelTable: sortedTable };
}

function handleScatter(){

}
function handleInsert(excelTable: ExcelTableData | null): Message {
  if (!excelTable)
    return { role: "bot", content: "No table to insert into" };

  const salesIndex = excelTable.header.indexOf("Sales");
  const costsIndex = excelTable.header.indexOf("Costs");
  const profitsIndex = excelTable.header.indexOf("Profits");

  if (salesIndex === -1 || costsIndex === -1)
    return { role: "bot", content: "Sales or Costs column not found" };
  if (profitsIndex !== -1)
    return { role: "bot", content: "Profits column already exists" };

  const newHeader = [...excelTable.header, "Profits"];
  const newRows = excelTable.rows.map(row => {
    const profits = row[salesIndex] - row[costsIndex];
    return [...row, profits];
  });

  const updatedTable = {
    ...excelTable,
    header: newHeader,
    rows: newRows
  };

  return { role: "bot", content: "Inserted Profits column", excelTable: updatedTable };
}