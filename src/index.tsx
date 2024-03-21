import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './components/app';
import reportWebVitals from './reportWebVitals';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { socket } from './providers/socket'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Widget from './components/widget';

socket.on('connect', () => {
  if(socket.connected) {
    console.log('CONECTOU')
    // socket.emit('join room', { _id: userId })
      // localStorage.setItem('socketId', socket.id)
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/widget",
    element: <Widget></Widget>
  },
  {
    path: "/chat",
    element: <App></App>
  }
]);
root.render(
  // <React.StrictMode>
    <ReactQueryProvider>
      <RouterProvider router={router} />
      {/* <App /> */}
    </ReactQueryProvider>
  // </React.StrictMode>
);

reportWebVitals();
