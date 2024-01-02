package com.lakeside.hotel.wrapper;

import javax.validation.constraints.NotBlank;

public class LoginRequest {
	@NotBlank
	private String email;
	@NotBlank
	private String password;
	public String refreshToken;

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
