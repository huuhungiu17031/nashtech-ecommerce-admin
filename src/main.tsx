import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';
import { AppProvider } from './context/AuthContext.tsx';
const client = new QueryClient();

const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: false,
    // refresh: refresh,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider store={store}>
        <AppProvider>
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        </AppProvider>
    </AuthProvider>,
);
