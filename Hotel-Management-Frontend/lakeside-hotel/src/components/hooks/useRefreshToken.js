// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthProvider";
// import { axiosGet } from "../utils/APIFunctions";

// const useRefreshToken = () => {
//     const auth = useContext(AuthContext);

//     const refresh = async () => {
//         const response = await axiosGet('/refresh', {
//             withCredentials: true
//         });
//         auth.setUser(prev => {
//             console.log(JSON.stringify(prev));
//             console.log(response.data.accessToken);
//             return { ...prev, accessToken: response.data.accessToken }
//         });
//         return response.data.accessToken;
//     }
//     return refresh;
// };

// export default useRefreshToken;