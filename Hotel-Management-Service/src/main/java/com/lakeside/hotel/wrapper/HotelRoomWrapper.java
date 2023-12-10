package com.lakeside.hotel.wrapper;

import java.math.BigDecimal;
import java.util.List;

import org.apache.tomcat.util.codec.binary.Base64;

public class HotelRoomWrapper {
	private Long id;
	private String roomType;
	private BigDecimal price;
	private boolean isBooked = false;
	private String roomPhoto;
	private List<BookingWrapper> bookings;

	public HotelRoomWrapper(Long id, String roomType, BigDecimal price) {
		super();
		this.id = id;
		this.roomType = roomType;
		this.price = price;
	}

	public HotelRoomWrapper(Long id, String roomType, BigDecimal price, boolean isBooked, byte[] roomPhotoBytes) {
		super();
		this.id = id;
		this.roomType = roomType;
		this.price = price;
		this.isBooked = isBooked;
		this.roomPhoto = roomPhotoBytes != null ? Base64.encodeBase64String(roomPhotoBytes) : null;
//		this.bookings = bookings;
	}

	public HotelRoomWrapper() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public boolean isBooked() {
		return isBooked;
	}

	public void setBooked(boolean isBooked) {
		this.isBooked = isBooked;
	}

	public String getRoomPhoto() {
		return roomPhoto;
	}

	public void setRoomPhoto(String roomPhoto) {
		this.roomPhoto = roomPhoto;
	}

	public List<BookingWrapper> getBookings() {
		return bookings;
	}

	public void setBookings(List<BookingWrapper> bookings) {
		this.bookings = bookings;
	}

	@Override
	public String toString() {
		return "HotelRoomWrapper [id=" + id + ", roomType=" + roomType + ", price=" + price + ", isBooked=" + isBooked
				+ ", roomPhoto=" + roomPhoto + ", bookings=" + bookings + "]";
	}

}
