import type { Message } from "./MessageParser";
const serverURL = import.meta.env.VITE_SERVER_URL;

export async function sendMessage(message: Message){
    console.log("Send message: ", message);  
    const serverURL = import.meta.env.VITE_SERVER_URL;

    const saveApi = "/api/saveMessages"; 

    fetch(serverURL + saveApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    });

}