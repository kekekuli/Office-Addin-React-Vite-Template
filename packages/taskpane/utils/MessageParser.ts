import type { ExcelTableData } from "../components/ExcelTable";
import {DateTime} from "luxon";
export interface Message{
  role: "user" | "bot";
  content: string;
  excelTable?: ExcelTableData;
  scatter?: boolean;
  sort?: boolean;
  insert?: boolean;
  timestap?: string; // In ISO 8601
}

export default function MessageParser(message : string, excelTable : ExcelTableData | null) : Message{
  const timestamp = DateTime.now().toISO();

  switch (message) {
    case "Sort the table by sales in descending order":
      return {...handleSort(excelTable), timestap: timestamp};
    case "Create a scatter plot of sales and costs":
      return {...handleScatter(excelTable), timestap: timestamp};
    case "Insert a column of profits":
      return {...handleInsert(excelTable), timestap: timestamp};
    case "kekekuli":
      return {role: "bot", content: "为时已晚，有机体!", timestap: timestamp};
    default:
      return {role: "bot", content: "No support for this command", timestap: timestamp};
  }
}

function handleSort(excelTable: ExcelTableData | null) : Message{
  // In fact, this condition should not be entered
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

  return { role: "bot", content: "Sorted table", excelTable: sortedTable , sort: true};
}

function handleScatter(excelTable: ExcelTableData | null) : Message{
  if (!excelTable)
    return {role: "bot", content: "No table to create scatter"};
  return {role: "bot", content: "create scatter", excelTable: excelTable, scatter: true};
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

  return { role: "bot", content: "Inserted Profits column", excelTable: updatedTable, insert: true };
}