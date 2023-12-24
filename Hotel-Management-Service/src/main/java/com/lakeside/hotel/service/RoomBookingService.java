package com.lakeside.hotel.service;

import java.util.List;

import com.lakeside.hotel.model.BookedRoom;

public interface RoomBookingService {

	public List<BookedRoom> getAllBookingsByRoomId(Long id);

	public List<BookedRoom> getAllBookings();

	public BookedRoom findByBookingConfirmationCode(String confirmationCode);

	public String saveBooking(Long roomId, BookedRoom bookingRequest);

	public void cancelRoomBooking(Long bookingId);

	public List<BookedRoom> getBookingsByUserEmail(String email);

}
