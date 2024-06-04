import { AuthContextInterface, AuthState, UserInfor, autoFetch } from '@/shared';
import { InternalAxiosRequestConfig } from 'axios';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const initialAuthState: AuthState = {
    accessToken: '',
    refreshToken: '',
    email: '',
    userId: 0,
    isAuthenticated: false,
};

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);
const exemptedUrls = ['login'];

const checkMethodAndUrlInterceptor = (config: InternalAxiosRequestConfig) => {
    if (config.method === 'get' && config.url && exemptedUrls.includes(config.url)) {
        delete config.headers.Authorization;
    }
    return config;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>(initialAuthState);
    const authHeader = useAuthHeader();
    const auth = useAuthUser<UserInfor>();
    const isAuthenticated = useIsAuthenticated();
    const bearerToken = 'Bearer ' + authState.accessToken;
    autoFetch.defaults.headers.common['Authorization'] = bearerToken;
    autoFetch.interceptors.request.use(
        config => checkMethodAndUrlInterceptor(config),
        function (error) {
            return Promise.reject(error);
        },
    );

    autoFetch.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response.status === 401) {
            }
            if (error.response.status === 403) {
            }
            if (error.response.status === 11000) {
            }
            return Promise.reject(error);
        },
    );
    const updateAuthTokens = (accessToken: string, refreshToken: string, isAuthenticated: boolean) => {
        setAuthState(prevState => ({
            ...prevState,
            accessToken,
            refreshToken,
            isAuthenticated,
        }));
    };

    useEffect(() => {
        let currentState = { ...authState };
        if (auth) {
            const { email, userId } = auth;
            currentState = { ...currentState, email, userId };
        }
        if (authHeader) {
            const accessToken = authHeader.split(' ')[1].toString();
            currentState = { ...currentState, accessToken };
        }
        if (isAuthenticated) {
            currentState = { ...currentState, isAuthenticated };
        }
        setAuthState(currentState);
    }, [auth, authHeader, isAuthenticated]);

    const authContextValue = {
        ...authState,
        updateAuthTokens,
    };
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

const useAuthentication = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuthentication must be used within a AuthProvider');
    return context;
};

export { useAuthentication, AppProvider };
