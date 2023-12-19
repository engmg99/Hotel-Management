package com.lakeside.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lakeside.hotel.model.BookedRoom;

public interface BookedRoomRepo extends JpaRepository<BookedRoom, Long> {

//	@Query("Select b from BookedRoom b where b.room =:roomId")
	public List<BookedRoom> findByRoom(Long roomId);

	public BookedRoom findByBookingConfirmationCode(String confirmationCode);

}
