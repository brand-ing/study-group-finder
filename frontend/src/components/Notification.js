//import React, { createContex, useContext, useReducer, useCallback } from 'react';
//import { createPortal } from 'react-dom';
//import { X } from lucide-react;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = (message, type = "default") => {
    toast(message, { type });
};

const Notification = () => {
    return(
        <div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default Notification;