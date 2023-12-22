package com.lakeside.hotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lakeside.hotel.model.HotelRoom;

public interface HotelRoomRepo extends JpaRepository<HotelRoom, Long> {

	@Query("Select DISTINCT r.roomType from HotelRoom r")
	public List<String> findDistinctRoomTypes();

	@Query("Select r from HotelRoom r Where r.roomType LIKE %:roomType% "
			+ "AND r.id NOT IN (Select b.room.id FROM BookedRoom b "
			+ "WHERE ((b.checkInDate <= :checkInDate) AND (b.checkOutDate >= :checkOutDate)))")
	public List<HotelRoom> findAvailableRoomsByDateAndType(@Param("checkInDate") LocalDate checkInDate,
			@Param("checkOutDate") LocalDate checkOutDate, @Param("roomType") String roomType);

}
