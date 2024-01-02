package com.lakeside.hotel.wrapper;

import java.time.Instant;

public class UserToken {
	private TokenType tokenType;
	private String tokenValue;
	private Long duration;
	private Instant expiryDate;

	public enum TokenType {
		ACCESS, REFRESH
	}

	public UserToken(TokenType tokenType, String tokenValue, Long duration, Instant expiryDate) {
		super();
		this.tokenType = tokenType;
		this.tokenValue = tokenValue;
		this.duration = duration;
		this.expiryDate = expiryDate;
	}

	public TokenType getTokenType() {
		return tokenType;
	}

	public void setTokenType(TokenType tokenType) {
		this.tokenType = tokenType;
	}

	public String getTokenValue() {
		return tokenValue;
	}

	public void setTokenValue(String tokenValue) {
		this.tokenValue = tokenValue;
	}

	public Long getDuration() {
		return duration;
	}

	public void setDuration(Long duration) {
		this.duration = duration;
	}

	public Instant getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(Instant expiryDate) {
		this.expiryDate = expiryDate;
	}

}
