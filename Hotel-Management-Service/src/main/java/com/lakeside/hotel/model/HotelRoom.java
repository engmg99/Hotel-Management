package com.lakeside.hotel.model;

import java.math.BigDecimal;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.RandomStringUtils;

@Entity
@Table(name = "Hotel_Rooms")
public class HotelRoom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String roomType;
	private BigDecimal price;
	private boolean isBooked = false;
	@Lob
	private Blob roomPhoto;
	@OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // when we delete this room then
																						// all the related room bookings
																						// will be deleted due to
																						// cascade all
	private List<BookedRoom> bookings;

	public HotelRoom() {
		this.bookings = new ArrayList<>(); // to avoid null pointer exception
	}

	public HotelRoom(String roomType, BigDecimal price, boolean isBooked, Blob roomPhoto, List<BookedRoom> bookings) {
		super();
		this.roomType = roomType;
		this.price = price;
		this.isBooked = isBooked;
		this.roomPhoto = roomPhoto;
		this.bookings = bookings;
	}

	public void addBooking(BookedRoom booking) {
		if (bookings == null) {
			bookings = new ArrayList<>();
		}
		bookings.add(booking);
		booking.setRoom(this);
		isBooked = true;
		String bookingCode = RandomStringUtils.randomNumeric(10);
		booking.setBookingConfirmationCode(bookingCode);
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

	public List<BookedRoom> getBookings() {
		return bookings;
	}

	public void setBookings(List<BookedRoom> bookings) {
		this.bookings = bookings;
	}

	public Blob getRoomPhoto() {
		return roomPhoto;
	}

	public void setRoomPhoto(Blob roomPhoto) {
		this.roomPhoto = roomPhoto;
	}

	@Override
	public String toString() {
		return "HotelRoom [id=" + id + ", roomType=" + roomType + ", price=" + price + ", isBooked=" + isBooked
				+ ", roomPhoto=" + roomPhoto + ", bookings=" + bookings + "]";
	}

}
