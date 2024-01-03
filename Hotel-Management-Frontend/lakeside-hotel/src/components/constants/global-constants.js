export class GlobalConstants {
    //Message
    static genericError = 'Something went wrong. Please try again later.';
    static userLogoutMsg = 'Logout Successfully.';

    //Regex
    static firstLastNameRegex = '[a-zA-Z]{3,24}';
    static nameRegex = '[a-zA-Z0-9 ]*';

    static emailRegex = '[A-Za-z0-9._%\\-]+@[A-Za-z0-9._%\\-]+\\.[a-z]{2,3}';

    static contactNumberRegex = '^[e0-9]{10,10}$';
    static PWD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$';

    //Variable
    static error = 'error';

    //API URL's
    static BASE_ROOM_URL = '/room'
    static BASE_BOOKING_URL = '/bookings'
    static BASE_AUTH_URL = '/api/auth'
    static BASE_USER_URL = '/api/user'
    static BASE_ROLE_URL = '/api/roles'

    //Public Apis
    static USER_LOGIN = `${this.BASE_AUTH_URL}/login`;
    static TOKEN_REFRESH = `${this.BASE_AUTH_URL}/v1/refresh`;
    static REGISTER_USER = `${this.BASE_AUTH_URL}/register-user`;
    static GET_ALL_ROOM_TYPES = `${this.BASE_ROOM_URL}/get-room-types`
    static GET_ALL_ROOMS = `${this.BASE_ROOM_URL}/all-rooms`
    static ADD_NEW_ROOM = `${this.BASE_ROOM_URL}/add/new-room`;
    static GET_ALL_AVAILABLE_ROOMS_BY_DATE(checkIn, checkOut, roomType) {
        return `${this.BASE_ROOM_URL}/findRoomByDate?checkInDate=${checkIn}&checkOutDate=${checkOut}&roomType=${roomType}`;
    }
    static EDIT_ROOM_BY_ID(roomId) {
        return `${this.BASE_ROOM_URL}/edit/room/${roomId} `;
    }
    static GET_ROOM_BY_ID(roomId) {
        return `${this.BASE_ROOM_URL}/get/room/${roomId} `;
    }
    static DELETE_ROOM_BY_ID(roomId) {
        return `${this.BASE_ROOM_URL}/delete/room/${roomId} `;
    }

    //Protected Apis
    static USER_LOGOUT = `${this.BASE_AUTH_URL}/logout`;
    static GET_ALL_BOOKING = `${this.BASE_BOOKING_URL}/all`
    static BOOK_ROOM_BY_ID(roomId) {
        return `${this.BASE_BOOKING_URL}/book-room/${roomId}`;
    }
    static GET_ALL_BOOKING_DONE_BY_USER(email) {
        return `${this.BASE_BOOKING_URL}/user/${email}/bookings`;
    }
    static GET_ROOM_BOOKING_BY_CODE(code) {
        return `${this.BASE_BOOKING_URL}/confirmation/${code}`;
    }
    static CANCEL_ROOM_BOOKING_BY_ID(bookingId) {
        return `${this.BASE_BOOKING_URL}/cancel-booking/${bookingId}`;
    }
    static GET_USER_BY_ID(userId) {
        return `${this.BASE_USER_URL}/find/${userId}`;
    }
    static DELETE_USER_BY_ID(userId) {
        return `${this.BASE_USER_URL}/delete/${userId}`;
    }
}
