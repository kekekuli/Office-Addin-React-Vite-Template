import { Bounce } from "react-toastify";
import type { ToastOptions } from "react-toastify";

export const toastOptins:ToastOptions = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
}