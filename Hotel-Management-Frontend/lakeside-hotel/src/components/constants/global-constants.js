export class GlobalConstants {
    //Message
    static genericError = 'Something went wrong. Please try again later.';

    //Regex
    static nameRegex = '[a-zA-Z0-9 ]*';

    static emailRegex = '[A-Za-z0-9._%\\-]+@[A-Za-z0-9._%\\-]+\\.[a-z]{2,3}';

    static contactNumberRegex = '^[e0-9]{10,10}$';

    //Variable
    static error = 'error';

    //API URL's
    static BASE_ROOM_URL = '/room'
    static BASE_BOOKING_URL = '/bookings'

    static GET_ALL_ROOM_TYPES = `${this.BASE_ROOM_URL}/get-room-types`
    static GET_ALL_ROOMS = `${this.BASE_ROOM_URL}/all-rooms`
    static GET_ALL_BOOKING = `${this.BASE_BOOKING_URL}/bookings/all`

    static GET_ROOM_BY_ID(roomId) {
        return `${this.BASE_ROOM_URL}/get/room/${roomId}`;
    }
    static GET_ROOM_BOOKING_BY_CODE(code) {
        return `${this.BASE_BOOKING_URL}/confirmation/${code}`;
    }
    static BOOK_ROOM_BY_ID(roomId) {
        return `${this.BASE_BOOKING_URL}/book-room/${roomId}`;
    }
    static DELETE_ROOM_BY_ID(roomId) {
        return `${this.BASE_ROOM_URL}/delete/room/${roomId}`;
    }
    static CANCEL_ROOM_BOOKING_BY_ID(bookingId) {
        return `${this.BASE_BOOKING_URL}/cancel-booking/${bookingId}`;
    }
}
