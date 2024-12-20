export interface Message{
  role: "user" | "bot";
  content: string;
  renderTable?: boolean;
}

export default function MessageParser(message : string) : Message{
  switch (message) {
    case "Sort the table by sales in descending order":
      return {role: "bot", content: "You want sort"};
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