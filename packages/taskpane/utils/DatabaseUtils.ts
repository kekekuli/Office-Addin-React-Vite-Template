import type { Message } from "./MessageParser";
import axios, {AxiosPromise} from "axios";
const serverURL = import.meta.env.VITE_SERVER_URL;

type AxiosRequests = AxiosPromise<any>;

function runTask(task: AxiosRequests): Promise<any> {
    return task.then((response) => {
        return Promise.resolve(response.data);
    }).catch((error) => {
        if (error.response)
            return Promise.reject(error.response.data.error);
        return Promise.reject("Can not connect to the server");
    })
}

export function sendMessage(message: Message) : Promise<any>{
    console.log("sendMessage called");

    const saveApi = "/api/saveMessages"; 
    const task = axios.post(serverURL + saveApi, {message}, {timeout: 2000})
    return runTask(task);
}

export function getMessages(){
    console.log("getMessages called");

    const getApi = "/api/getMessages";
    const task = axios.get(serverURL + getApi, {timeout: 2000})
    return runTask(task);
}
export function deleteMessages() {
    console.log("deleteMessages called");

    const deleteApi = "/api/deleteMessages";
    const task = axios.delete(serverURL + deleteApi, {timeout: 2000})
    return runTask(task);
}