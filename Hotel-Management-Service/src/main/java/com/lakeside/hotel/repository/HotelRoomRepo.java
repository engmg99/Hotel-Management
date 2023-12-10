package com.lakeside.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.lakeside.hotel.model.HotelRoom;

public interface HotelRoomRepo extends JpaRepository<HotelRoom, Long> {

	@Query("Select DISTINCT r.roomType from HotelRoom r")
	public List<String> findDistinctRoomTypes();

}
