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
import LandingPage from './pages/landing-page';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgot-password';
import NotFound from './pages/not-found';
import Dashboard from './pages/dashboard';
import ResetPassword from './pages/reset-password';
import { GoogleOAuthProvider } from '@react-oauth/google';

socket.on('connect', () => {
  if(socket.connected) {
    // socket.emit('join room', { _id: userId })
      // localStorage.setItem('socketId', socket.id)
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const dashboardPages = [
  {
    path: '/chat/inbox',
    element: <Dashboard tabActive={'Atendimento'} />
  },
  {
    path: '/kanban',
    element: <Dashboard tabActive={'CRM'} />
  },
  {
    path: '/marketing',
    element: <Dashboard tabActive={'Marketing'} />
  },
  {
    path: '/team',
    element: <Dashboard tabActive={'Equipe'} />
  },
  {
    path: '/call',
    element: <Dashboard tabActive={'Telefone'} />
  },
  {
    path: '/visitors',
    element: <Dashboard tabActive={'Visitantes'} />
  },
  {
    path: '/statistics',
    element: <Dashboard tabActive={'Estatísticas'} />
  },
  {
    path: '/billing',
    element: <Dashboard tabActive={'Faturamento'} />
  },
  {
    path: '/settings',
    element: <Dashboard tabActive={'Configurações'} />
  }
]
const normalPages = [
  {
    path: "/widget",
    element: <Widget></Widget>
  },
  {
    path: "/chat",
    element: <App></App>
  },
  {
    path: "/",
    element: <LandingPage></LandingPage>
  },
  {
    path: "/login",
    element: <Login></Login>
  },
  {
    path: "/sign-up",
    element: <Signup></Signup>
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword></ForgotPassword>
  },
  {
    path: "/reset-password",
    element: <ResetPassword></ResetPassword>
  },
  {
    path: "/dashboard",
    element: <Dashboard tabActive={'Atendimento'}></Dashboard>
  },
  {
    path: "*",
    element: <NotFound></NotFound>
  }
]
const router = createBrowserRouter([
  ...normalPages,
  ...dashboardPages
]);
root.render(
  <GoogleOAuthProvider clientId="991508836423-0l19fj8es9tmriinplmk5ftuevt2opnq.apps.googleusercontent.com">
    <ReactQueryProvider>
      <div className="bg-gray-50 min-h-[100dvh]">
        <RouterProvider router={router} />
      </div>
    </ReactQueryProvider>
  </GoogleOAuthProvider>
  // <React.StrictMode>
  // </React.StrictMode>
);

reportWebVitals();
