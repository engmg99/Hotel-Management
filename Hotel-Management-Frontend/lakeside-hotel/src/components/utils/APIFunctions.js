import axios from "axios";
import { GlobalConstants } from "../constants/global-constants";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
}

axiosInstance.interceptors.request.use(
    (config) => {
        // console.log('Req Intercept Config: ', config)
        return config
    },
    (error) => {
        // console.log('Req Intercept Error: ', error)
        return Promise.reject(error)
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // console.log('Res Intercept Response: ', response)
        return response;
    },
    (error) => {
        // console.log('Res Intercept Error: ', error)
        const originalConfig = error.config;
        const errResponse = error.response;
        if (originalConfig.url === GlobalConstants.VALIDATE_USER_SESSION && errResponse) {
            // Access Token was expired
            if (errResponse.status === 401) {
                //call refresh token api to generate new access token if the refreshToken is not expired
                refreshToken();
            }
        }
        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    try {
        const tokenRefresh = await axiosGet(GlobalConstants.TOKEN_REFRESH);
        if (tokenRefresh) {
            console.log("tokenRefresh", tokenRefresh);
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

// adds a new room to the DB
export async function addNewRoom(roomData) {

    const formData = new FormData(); // form Data which we will handle at Backend by @RequestParams
    formData.append("photo", roomData.roomPhoto);
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.price);

    const response = await axiosInstance.post("/room/add/new-room", formData);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

// update/edit the existing room
export async function updateRoom(roomId, roomData) {
    // by using this we can get the Data in backend by @RequestBody Attribute
    // const data = {
    //     roomType: roomData.roomType,
    //     price: roomData.roomPrice
    // }
    // by this we'll accept it using @RequestParam
    const formData = new FormData();
    formData.append("photo", roomData.roomPhoto);
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.price);
    const result = await axiosInstance.put(`/room/edit/room/${roomId}`, formData)
    return result;
}

// this will get all room booking available
export async function getAllRoomBookings() {
    try {
        const response = await axiosInstance.get(`/bookings/all`);
        return response.data;
    } catch (error) {
        throw new Error("Error while get room booking", error);
    }
}

/** this will get the room booking by Confirmation code */
export async function getRoomBookingByConfirmationCode(code) {
    try {
        const response = await axiosInstance.get(`/bookings/confirmation/${code}`);
        return response.data;
    } catch (error) {
        throw new Error("Error while get room booking by code", error);
    }
}

/** This function cancels the room booking */
export async function cancelRoomBooking(bookingId) {
    try {
        const response = await axiosInstance.delete(`/bookings/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        throw new Error("Error cancelling room booking", error);
    }
}


/**
 * Makes a GET request to the specified URL and returns the response data.
 * @param url - The URL to make the GET request to.
 * @param config - Optional Axios request configuration.
 */
export const axiosGet = async (url, config) => {
    if (config === true) {
        config = {
            headers: getHeaders()
        }
        console.log(config)
    }
    const response = await axiosInstance.get(url, config);
    return response.data;
}

/**
 * Sends a POST request to the specified URL with the given data and configuration.
 * @param {string} url The URL to send the request to.
 * @param {TRequest} data The data to send with the request.
 * @param {AxiosRequestConfig} [config] The configuration for the request.
 */
export const axiosPost = async (url, data, config) => {
    if (config === true) {
        config = {
            headers: getHeaders()
        }
        console.log(config)
    }
    const response = await axiosInstance.post(url, data, config);
    return response.data;
};

/**
 * Sends a PUT request to the specified URL with the provided data and configuration.
 * @param {string} url The URL to send the request to.
 * @param {TRequest} data The data to send with the request.
 * @param {AxiosRequestConfig} [config] The configuration for the request.
 */
export const axiosPut = async (url, data, config) => {
    if (config === true) {
        config = {
            headers: getHeaders()
        }
        console.log(config)
    }
    const response = await axiosInstance.put(url, data, config);
    return response.data;
};

/**
 * Sends a DELETE request to the specified URL using axiosInstance.
 * @param {string} url The URL to send the request to.
 * @param {AxiosRequestConfig} [config] The optional request configuration.
 */
export const axiosDelete = async (url, config) => {
    if (config === true) {
        config = {
            headers: getHeaders()
        }
        console.log(config)
    }
    const response = await axiosInstance.delete(url, config);
    return response.data;
};