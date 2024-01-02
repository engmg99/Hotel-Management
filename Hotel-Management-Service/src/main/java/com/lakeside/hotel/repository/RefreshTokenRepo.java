package com.lakeside.hotel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lakeside.hotel.model.RefreshToken;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, Long> {
	public Optional<RefreshToken> findByRefreshToken(String refreshToken);
}