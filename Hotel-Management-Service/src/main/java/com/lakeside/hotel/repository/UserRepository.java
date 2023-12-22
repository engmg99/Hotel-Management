package com.lakeside.hotel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lakeside.hotel.model.HotelUser;

public interface UserRepository extends JpaRepository<HotelUser, Long> {

	public boolean existsByEmail(String email);

	public void deleteByEmail(String email);

	public Optional<HotelUser> findByEmail(String email);

	public Optional<HotelUser> findById(Long id);

}
