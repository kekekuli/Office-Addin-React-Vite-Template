import type { Message } from "./MessageParser";
import axios from "axios";
const serverURL = import.meta.env.VITE_SERVER_URL;

export async function sendMessage(message: Message){
    console.log("Send message: ", message);  

    const saveApi = "/api/saveMessages"; 
    
    return axios.post(serverURL + saveApi, {message}, {}).then((response) => {
        console.log("Message saved", response.data);
        if (response.data.success){
            return Promise.resolve(response.data);
        }
    }).catch((error) => {
        if (error.response){
            return Promise.reject(error.response.data.error);
        }
        return Promise.reject("Can not connect to the server");
    })
}

export async function getMessages(){
    const getApi = "/api/getMessages";
    return axios.get(serverURL + getApi).then((response) => {
        console.log("Get messages", response.data);
        return Promise.resolve(response.data);
    }).catch((error) => {
        if (error.response){
            return Promise.reject(error.response.data.error);
        }
        return Promise.reject("Can not connect to the server");
    })
}