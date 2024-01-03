import { GlobalConstants } from "../constants/global-constants";
import { axiosInstance } from "../utils/APIFunctions";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const auth = useAuth();

    const refreshToken = async () => {
        try {
            const tokenRefresh = await axiosInstance.get(GlobalConstants.TOKEN_REFRESH);
            // console.log("tokenRefresh", tokenRefresh);
            if (tokenRefresh?.data?.status == 'SUCCESS') {
                auth.handleLogin(tokenRefresh?.data);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };
    return refreshToken;
};

export default useRefreshToken;