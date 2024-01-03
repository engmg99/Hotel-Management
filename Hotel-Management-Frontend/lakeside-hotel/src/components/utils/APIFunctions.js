import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

// export const getHeaders = () => {
//     const token = localStorage.getItem("token");
//     return {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//     }
// }

// /**
//  * makes a get request to the specified url and returns the response data.
//  * @param url - the url to make the get request to.
//  * @param config - optional axios request configuration.
//  */
// export const axiosget = async (url, config) => {
//     // if (config === true) {
//     //     config = {
//     //         headers: getheaders()
//     //     }
//     //     console.log(config)
//     // }
//     const response = await axiosinstance.get(url, config);
//     return response.data;
// }

// /**
//  * sends a post request to the specified url with the given data and configuration.
//  * @param {string} url the url to send the request to.
//  * @param {trequest} data the data to send with the request.
//  * @param {axiosrequestconfig} [config] the configuration for the request.
//  */
// export const axiospost = async (url, data, config) => {
//     // if (config === true) {
//     //     config = {
//     //         headers: getheaders()
//     //     }
//     //     console.log(config)
//     // }
//     const response = await axiosinstance.post(url, data, config);
//     return response.data;
// };

// /**
//  * sends a put request to the specified url with the provided data and configuration.
//  * @param {string} url the url to send the request to.
//  * @param {trequest} data the data to send with the request.
//  * @param {axiosrequestconfig} [config] the configuration for the request.
//  */
// export const axiosput = async (url, data, config) => {
//     // if (config === true) {
//     //     config = {
//     //         headers: getheaders()
//     //     }
//     //     console.log(config)
//     // }
//     const response = await axiosinstance.put(url, data, config);
//     return response.data;
// };

// /**
//  * sends a delete request to the specified url using axiosinstance.
//  * @param {string} url the url to send the request to.
//  * @param {axiosrequestconfig} [config] the optional request configuration.
//  */
// export const axiosdelete = async (url, config) => {
//     // if (config === true) {
//     //     config = {
//     //         headers: getheaders()
//     //     }
//     //     console.log(config)
//     // }
//     const response = await axiosinstance.delete(url, config);
//     return response.data;
// };