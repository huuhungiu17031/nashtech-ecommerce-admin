import { autoFetch } from '@/shared';
import createRefresh from 'react-auth-kit/createRefresh';
const refreshTokenInterval = 72 * 60 * 60;
const accessTokenInterval = 48 * 60 * 60;
export const refresh = createRefresh({
    interval: refreshTokenInterval,
    refreshApiCallback: async (param): Promise<any> => {
        try {
            const response = await autoFetch.post('/refresh', param, {
                headers: { Authorization: `Bearer ${param.refreshToken}` },
            });
            return {
                isSuccess: true,
                newAuthToken: response.data.accessToken,
                newAuthTokenExpireIn: accessTokenInterval,
                newRefreshTokenExpiresIn: refreshTokenInterval,
            };
        } catch (error) {
            console.error(error);
            return {
                isSuccess: false,
            };
        }
    },
});
