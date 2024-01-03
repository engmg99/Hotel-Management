import { GlobalConstants } from "../constants/global-constants";
import { axiosInstance } from "../utils/APIFunctions";

const useRefreshToken = () => {

    const refreshToken = async () => {
        try {
            const tokenRefresh = await axiosInstance.get(GlobalConstants.TOKEN_REFRESH);
            if (tokenRefresh) {
                console.log("tokenRefresh", tokenRefresh);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };
    return refreshToken;
};

export default useRefreshToken;