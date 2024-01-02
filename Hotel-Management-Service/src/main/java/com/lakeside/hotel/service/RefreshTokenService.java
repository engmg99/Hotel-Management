package com.lakeside.hotel.service;

import com.lakeside.hotel.model.RefreshToken;

public interface RefreshTokenService {
	public RefreshToken createRefreshToken(String username);

	public RefreshToken verifyRefreshToken(String refreshToken);
}
