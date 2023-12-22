package com.lakeside.hotel.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.lakeside.hotel.model.HotelRoom;

public interface IRoomService {

	public HotelRoom addNewRoom(MultipartFile file, String roomype, BigDecimal roomPrice);

	public List<String> getAllRoomTypes();

	public List<HotelRoom> getAllAvailableRooms();

	public byte[] getRoomPhotoByRoomId(Long roomId);

	public void deleteRoomById(Long roomId);

	public HotelRoom getRoomById(Long roomId);

	public HotelRoom updateRoom(HotelRoom newRoomObject);

	public List<HotelRoom> getAvailableRoomsByDate(LocalDate checkInDate, LocalDate checkOutDate, String roomType);
}
