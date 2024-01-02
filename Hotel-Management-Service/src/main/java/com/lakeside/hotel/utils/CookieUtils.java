package com.lakeside.hotel.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {

	@Value("${jwt.cookieExpiry}")
	private int cookieExpiry;

	@Value("${authentication.auth.accessTokenCookieName}")
	private String accessTokenCookieName;

	@Value("${authentication.auth.refreshTokenCookieName}")
	private String refreshTokenCookieName;

	public HttpCookie createAccessTokenCookie(String token, Long duration) {
		String encryptedToken = SecurityCipher.encrypt(token);
		return ResponseCookie.from(accessTokenCookieName, encryptedToken).maxAge(-1).httpOnly(true).secure(false)
				.path("/").build();
	}

	public HttpCookie createRefreshTokenCookie(String token, Long duration) {
		String encryptedToken = SecurityCipher.encrypt(token);
		return ResponseCookie.from(refreshTokenCookieName, encryptedToken).maxAge(-1).httpOnly(true).secure(false)
				.path("/").build();
	}

	public HttpCookie deleteAccessTokenCookie() {
		return ResponseCookie.from(accessTokenCookieName, "").maxAge(0).httpOnly(true).secure(false).path("/").build();
	}

//	ANOTHER WAY TO SET COOKIES
//	ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken).httpOnly(true).secure(false)
//			.path("/").maxAge(cookieExpiry).build();
//	response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
}
