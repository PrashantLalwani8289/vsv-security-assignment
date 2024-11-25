import React from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'feather-icons/dist/feather.css';
import 'feather-icons'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'
// import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom'
import { persistor, store } from './state_management/store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

// ReactGA.initialize('G-794R7FLKTE');
// ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
