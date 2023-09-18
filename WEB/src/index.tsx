import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MySnackbar from './helper/SnackBar';
import axios from 'axios';
import { persistor, store } from './redux/store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import ProtectedRoute from './routes/ProtectedRoute';
import _ from 'lodash';
import PageNotFound from './components/common/PageNotFound';
import { CustomBackdrop } from './helper/backDrop';


const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}


const Index = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

  axios.interceptors.request.use(config => {
    setIsRequestPending(true);
    return config;
  });

  axios.interceptors.response.use(
    response => {
      setIsRequestPending(false);
      return response;
    },
    async error => {
      if (error?.response?.status === 401) {
        setIsRequestPending(false);
        setSnackbarMessage(String(error?.response?.data));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        const handleLogout = async () => {
          setSnackbarOpen(false);
          store.dispatch({ type: 'reset', all: true });
          persistor.purge();
          await Promise.all([
            new Promise<void>((resolve) => {
              localStorage.clear();
              resolve();
            }),
          ]);
          // ProtectedRoute();
          window.location.href = '/';
        };
        setTimeout(() => {
          handleLogout();
        }, 2000);
      }

      if (error?.response?.status === 404 || error?.response?.status === 400) {
        setIsRequestPending(false);
        if (_.isString(error?.response?.data)) {
          setSnackbarMessage(String(error?.response?.data));
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 2000);
        }
      }
      if (error?.response?.status === 404) {
        setIsRequestPending(false);
        setIsError(true);
      }
      return Promise.reject(error);
    }
  );

  // require('dotenv').config();
  //console.log = () => {}
  // console.error = () => {}
  // console.debug = () => {}

  return (
      <>
        <DndProvider backend={backend}>
          <CustomBackdrop
            open={isRequestPending}
          />
          {isError ? <PageNotFound /> : <App />}
        </DndProvider>
        <MySnackbar
          className="snack-bar"
          message={snackbarMessage}
          severity={snackbarSeverity}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
        />
      </>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Index />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
