export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    email: string;
    userId: number;
    isAuthenticated: boolean;
}

export interface AuthContextInterface extends AuthState {
    updateAuthTokens: (accessToken: string, refreshToken: string, isAuthenticated: boolean) => void;
}

export interface UserInfor {
    email: string;
    userId: number;
}
