package com.lakeside.hotel.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.RefreshToken;
import com.lakeside.hotel.repository.RefreshTokenRepo;
import com.lakeside.hotel.repository.UserRepository;
import com.lakeside.hotel.service.RefreshTokenService;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

	public static final long TOKEN_VALIDITY = 5 * 60 * 60 * 10000;

	@Autowired
	private RefreshTokenRepo refreshTokenRepo;

	@Autowired
	private UserRepository userRepo;

	@Override
	public RefreshToken createRefreshToken(String username) {
		HotelUser user = userRepo.findByEmail(username).get();
		RefreshToken token = user.getUserRefreshToken();
		// if token is present then increase its expiry from now and if not then create
		// new token
		if (user != null) {
			token = user.getUserRefreshToken();
		}

		if (token != null) {
			token.setExpiry(Instant.now().plusMillis(TOKEN_VALIDITY));
		} else {
			token = new RefreshToken(UUID.randomUUID().toString(), Instant.now().plusMillis(TOKEN_VALIDITY),
					userRepo.findByEmail(username).get());
			refreshTokenRepo.save(token);
		}
		return token;
	}

	@Override
	public RefreshToken verifyRefreshToken(String refreshToken) {
		RefreshToken token = refreshTokenRepo.findByRefreshToken(refreshToken)
				.orElseThrow(() -> new RuntimeException("Invalid Token"));
		if (token.getExpiry().compareTo(Instant.now()) < 0) {
			refreshTokenRepo.delete(token);
			new Exception("Refresh Token Expired");
		}
		return token;
	}

}
