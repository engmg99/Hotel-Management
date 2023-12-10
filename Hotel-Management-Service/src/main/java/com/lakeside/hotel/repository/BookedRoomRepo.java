package com.lakeside.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lakeside.hotel.model.BookedRoom;

public interface BookedRoomRepo extends JpaRepository<BookedRoom, Long> {

	@Query("Select b from BookedRoom b where b.room =:roomId")
	public List<BookedRoom> getBookingByRoomId(@Param("roomId") Long id);

}
