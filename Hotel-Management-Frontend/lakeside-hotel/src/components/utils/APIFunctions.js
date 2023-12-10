import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:9192/lakeside_hotel'
})

// adds a new room to the DB
export async function addNewRoom(photo, roomType, roomPrice) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("roomType", roomType);
    formData.append("roomPrice", roomPrice);

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