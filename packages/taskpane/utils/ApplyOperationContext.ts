// Provide context that holds the callback function to when apply button clicked
import { createContext } from "react";
import type { Message } from "./MessageParser";

export const ApplyOperationContext = createContext<(message : Message) => void>((message) => {
    console.log("Processing apply message: ", message.content);
 });