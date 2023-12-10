package com.lakeside.hotel.service;

import java.util.List;

import com.lakeside.hotel.model.BookedRoom;

public interface BookedRoomService {

	public List<BookedRoom> getAllBookingsByRoomId(Long id);

}
