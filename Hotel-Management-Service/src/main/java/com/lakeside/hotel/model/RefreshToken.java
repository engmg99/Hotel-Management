package com.lakeside.hotel.model;

import java.time.Instant;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "refresh_token")
public class RefreshToken {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long tokenId;
	private String refreshToken;
	private Instant expiry;
	@OneToOne
	private HotelUser user;

	public RefreshToken() {
		super();
	}

	public RefreshToken(String refreshToken, Instant expiry) {
		super();
		this.refreshToken = refreshToken;
		this.expiry = expiry;
	}

	public RefreshToken(String refreshToken, Instant expiry, HotelUser user) {
		super();
		this.refreshToken = refreshToken;
		this.expiry = expiry;
		this.user = user;
	}

	public long getTokenId() {
		return tokenId;
	}

	public void setTokenId(long tokenId) {
		this.tokenId = tokenId;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public Instant getExpiry() {
		return expiry;
	}

	public void setExpiry(Instant expiry) {
		this.expiry = expiry;
	}

	public HotelUser getUser() {
		return user;
	}

	public void setUser(HotelUser user) {
		this.user = user;
	}

}
