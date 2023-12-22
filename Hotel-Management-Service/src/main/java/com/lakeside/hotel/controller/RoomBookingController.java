package com.lakeside.hotel.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.exception.InvalidBookingRequestException;
import com.lakeside.hotel.exception.ResourceNotFoundException;
import com.lakeside.hotel.model.BookedRoom;
import com.lakeside.hotel.model.HotelRoom;
import com.lakeside.hotel.service.RoomBookingService;
import com.lakeside.hotel.service.impl.HotelRoomServiceImpl;
import com.lakeside.hotel.wrapper.BookingWrapper;
import com.lakeside.hotel.wrapper.HotelRoomWrapper;

@RestController
@RequestMapping("/bookings/")
@CrossOrigin("http://localhost:5173") // allowed CORS region for React server
public class RoomBookingController {
	@Autowired
	private RoomBookingService roomBookingService;

	@Autowired
	private HotelRoomServiceImpl roomService;

	@GetMapping("/all")
	public ResponseEntity<List<BookingWrapper>> getAllBookings() {
		List<BookedRoom> bookings = roomBookingService.getAllBookings();
		List<BookingWrapper> bookingResponse = new ArrayList<>();
		for (BookedRoom obj : bookings) {
			BookingWrapper response = getBookingWrapperResponse(obj);
			bookingResponse.add(response);
		}
		return ResponseEntity.ok(bookingResponse);
	}

	private BookingWrapper getBookingWrapperResponse(BookedRoom roomToBeBooked) {
		HotelRoom room = roomService.getRoomById(roomToBeBooked.getRoom().getId());
		HotelRoomWrapper roomResponse = new HotelRoomWrapper(room.getId(), room.getRoomType(), room.getPrice());
		BookingWrapper bookedRoom = new BookingWrapper(roomToBeBooked.getBookingId(), roomToBeBooked.getCheckInDate(),
				roomToBeBooked.getCheckOutDate(), roomToBeBooked.getGuestName(), roomToBeBooked.getGuestEmail(),
				roomToBeBooked.getNoOfAdults(), roomToBeBooked.getNoOfChildren(), roomToBeBooked.getTotalGuests(),
				roomToBeBooked.getBookingConfirmationCode(), roomResponse);
		return bookedRoom;
	}

	@GetMapping("/confirmation/{code}")
	public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable("code") String confirmationCode) {
		try {
			BookingWrapper response = null;
			BookedRoom booking = roomBookingService.findByBookingConfirmationCode(confirmationCode);
			if (booking != null) {
				response = getBookingWrapperResponse(booking);
			}
			return ResponseEntity.ok(response);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PostMapping("/book-room/{roomId}")
	public ResponseEntity<?> saveRoomBooking(@PathVariable Long roomId, @RequestBody BookedRoom bookingRequest) {
		try {
			String confirmationCode = roomBookingService.saveBooking(roomId, bookingRequest);
			return ResponseEntity.ok("Room Booked Successfully, Booking Confirmation code is: " + confirmationCode);
		} catch (InvalidBookingRequestException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/cancel-booking/{bookingId}")
	public void cancelBooking(@PathVariable Long bookingId) {
		roomBookingService.cancelRoomBooking(bookingId);
	}
}
