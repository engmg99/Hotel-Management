package com.lakeside.hotel.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.exception.InvalidBookingRequestException;
import com.lakeside.hotel.model.BookedRoom;
import com.lakeside.hotel.model.HotelRoom;
import com.lakeside.hotel.repository.BookedRoomRepo;
import com.lakeside.hotel.service.RoomBookingService;

@Service
public class RoomBookingServiceImpl implements RoomBookingService {

	@Autowired
	private BookedRoomRepo roomBookingRepo;

	@Autowired
	private HotelRoomServiceImpl roomService;

	@Override
	public List<BookedRoom> getAllBookingsByRoomId(Long id) {
		return roomBookingRepo.findByRoom(id);
	}

	@Override
	public List<BookedRoom> getAllBookings() {
		return roomBookingRepo.findAll();
	}

	@Override
	public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
		return roomBookingRepo.findByBookingConfirmationCode(confirmationCode);
	}

	@Override
	public String saveBooking(Long roomId, BookedRoom bookingRequest) {
		if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
			throw new InvalidBookingRequestException("Check-In Date must come before check-out date");
		}
		HotelRoom room = roomService.getRoomById(roomId);
		List<BookedRoom> existingBookings = room.getBookings();
		boolean isRoomAvailable = roomIsAvailable(bookingRequest, existingBookings);
		if (isRoomAvailable) {
			room.addBooking(bookingRequest);
			roomBookingRepo.save(bookingRequest);
		} else {
			throw new InvalidBookingRequestException("This room has been booked for the selected dates.");
		}
		return bookingRequest.getBookingConfirmationCode();
	}

	private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
		return existingBookings.stream()
				.noneMatch(existingBooking -> bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
						|| bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
						|| (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
								&& bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
						|| (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

								&& bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
						|| (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

								&& bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

						|| (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
								&& bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))
						|| (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
								&& bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate())));

	}

	@Override
	public void cancelRoomBooking(Long bookingId) {
		roomBookingRepo.deleteById(bookingId);
	}

}
