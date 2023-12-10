package com.lakeside.hotel.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.model.BookedRoom;
import com.lakeside.hotel.repository.BookedRoomRepo;
import com.lakeside.hotel.service.BookedRoomService;

@Service
public class BookedRoomServiceImpl implements BookedRoomService {

	@Autowired
	private BookedRoomRepo roomBookingRepo;

	@Override
	public List<BookedRoom> getAllBookingsByRoomId(Long id) {
		return roomBookingRepo.getBookingByRoomId(id);
	}

}
