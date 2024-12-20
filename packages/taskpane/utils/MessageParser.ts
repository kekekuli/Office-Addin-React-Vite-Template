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
      return {role: "bot", content: "You want insert"};
    case "kekekuli":
      return {role: "bot", content: "为时已晚，有机体!"};
    default:
      return {role: "bot", content: "No support for this command"};
  }
}

function handleSort(excelTable: ExcelTableData | null) : Message{
  if (!excelTable)
    return {role: "bot", content: "No table to sort"};
  return {role: "bot", content: "You want sort"};
}

function handleScatter(){

}
function handleInsert(){

}