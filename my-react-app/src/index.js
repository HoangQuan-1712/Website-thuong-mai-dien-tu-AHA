import 'antd/dist/reset.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './redux/store'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SocketProvider } from './context/SocketContext';

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <QueryClientProvider client={queryClient}>
    {/* <Todos /> */}
    <React.StrictMode>
      <Provider store={store}>
        <SocketProvider>
          <App />
        </SocketProvider>

      </Provider>
    </React.StrictMode>
    <ReactQueryDevtools initialIsOpen={false} />

  </QueryClientProvider>
);

reportWebVitals();
