import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:9192/lakeside_hotel'
})

// adds a new room to the DB
export async function addNewRoom(roomData) {

    const formData = new FormData(); // form Data which we will handle at Backend by @RequestParams
    formData.append("photo", roomData.roomPhoto);
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.price);

    const response = await api.post("/room/add/new-room", formData);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

// Get all the room types from DB
export async function getRoomTypes() {
    try {
        const response = await api.get("/room/get-room-types");
        return response.data;
    } catch (error) {
        throw new Error("Error fetching room types", error);
    }
}

// get all existing rooms
export async function getAllRooms() {
    try {
        const result = await api.get("/room/all-rooms")
        // console.log(result)
        return result.data;
    } catch (error) {
        throw new Error("Error fetching all room", error);
    }
}

// delete the existing room
export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/room/delete/room/${roomId}`)
        return result.data;
    } catch (error) {
        throw new Error("Error deleting room", error);
    }
}

// update/edit the existing room
export async function updateRoom(roomId, roomData) {
    try {
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
        const result = await api.put(`/room/edit/room/${roomId}`, formData)
        return result;
    } catch (error) {
        throw new Error("Error updating room", error);
    }
}

//get room data by roomId
export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/room/get/room/${roomId}`)
        return result.data;
    } catch (error) {
        throw new Error("Error getting room by Id", error);
    }
}

//this will book a room
export async function bookRoom(roomId, bookingInfo) {
    try {
        const response = await api.post(`/bookings/book-room/${roomId}`, bookingInfo);
        return response.data;
    } catch (error) {
        throw new Error("Error while booking room", error);
    }
}

// this will get all room booking available
export async function getAllRoomBookings() {
    try {
        const response = await api.get(`/bookings/all`);
        return response.data;
    } catch (error) {
        throw new Error("Error while get room booking", error);
    }
}

/** this will get the room booking by Confirmation code */
export async function getRoomBookingByConfirmationCode(code) {
    try {
        const response = await api.get(`/bookings/confirmation/${code}`);
        return response.data;
    } catch (error) {
        throw new Error("Error while get room booking by code", error);
    }
}

/** This function cancels the room booking */
export async function cancelRoomBooking(bookingId) {
    try {
        const response = await api.delete(`/bookings/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        throw new Error("Error cancelling room booking", error);
    }
}