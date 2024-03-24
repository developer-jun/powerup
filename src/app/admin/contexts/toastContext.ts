import { createContext } from 'react';
// why we use two context variables below?
export const ToastContext = createContext(null); // used to get the data of our context
export const TasksDispatchContext = createContext(null); // used to update the data of the context