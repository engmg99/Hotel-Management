import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "../utils/APIFunctions";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const auth = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // if (!config.headers['Authorization']) {
                //     config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                // }
                return config;
            }, (error) => {
                return Promise.reject(error);
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => {
                return response
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true; // setting the so that the request is sent only one time
                    // get the new access token with help of refresh token
                    await refresh();
                    // prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // here we updated the request with new access token received via refresh method and it'll hit backend again with new access token
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;