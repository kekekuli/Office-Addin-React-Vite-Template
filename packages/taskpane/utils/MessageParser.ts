import type { ExcelTableData } from "../components/ExcelTable";
import { sendMessage } from "./DatabaseUtils";
import {DateTime} from "luxon";
export interface Message{
  role: "user" | "bot";
  content: string;
  excelTable?: ExcelTableData;
  scatter?: boolean;
  sort?: boolean;
  insert?: boolean;
  timestap?: string; // In ISO 8601
  savedId?: string;
}

export default function MessageParser(message : string, excelTable : ExcelTableData | null) : Promise<Message> {
  const timestamp = DateTime.now().toISO();

  let processedMessage;

  switch (message) {
    case "Sort the table by sales in descending order":
      processedMessage = {...handleSort(excelTable), timestap: timestamp};
      break;
    case "Create a scatter plot of sales and costs":
      processedMessage = {...handleScatter(excelTable), timestap: timestamp};
      break;
    case "Insert a column of profits":
      processedMessage = {...handleInsert(excelTable), timestap: timestamp};
      break;
    case "kekekuli":
      processedMessage = {role: "bot", content: "为时已晚，有机体!", timestap: timestamp};
      break;
    default:
      processedMessage = {role: "bot", content: "No support for this command", timestap: timestamp};
      break;
  }

  return sendMessage(processedMessage).then((response) => {
    const { savedId } = response;
    processedMessage.savedId = savedId;
    return processedMessage;
  }).catch((errMsg) => {
    return Promise.reject({
      message: processedMessage,
      errMsg: errMsg
    });
  });
}

function handleSort(excelTable: ExcelTableData | null) : Message{
  // In fact, this condition should not be entered
  if (!excelTable)
    return {role: "bot", content: "No table to sort"};


  return { role: "bot", content: "Sorted table", excelTable: excelTable , sort: true};
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