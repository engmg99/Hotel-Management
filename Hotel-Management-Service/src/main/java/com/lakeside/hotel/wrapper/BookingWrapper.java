package com.lakeside.hotel.wrapper;

import java.time.LocalDate;

import com.lakeside.hotel.model.HotelRoom;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BookingWrapper {
	private Long bookingId;
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	private String guestName;
	private String guestEmail;
	private int noOfAdults;
	private int noOfChildren;
	private int totalGuests;
	private String bookingConfirmationCode;
	private HotelRoomWrapper room;

	public BookingWrapper() {
		super();
	}

	public BookingWrapper(Long bookingId, LocalDate checkInDate, LocalDate checkOutDate,
			String bookingConfirmationCode) {
		super();
		this.bookingId = bookingId;
		this.checkInDate = checkInDate;
		this.checkOutDate = checkOutDate;
		this.bookingConfirmationCode = bookingConfirmationCode;
	}

	public BookingWrapper(Long bookingId, LocalDate checkInDate, LocalDate checkOutDate, String guestName,
			String guestEmail, int noOfAdults, int noOfChildren, int totalGuests, String bookingConfirmationCode,
			HotelRoomWrapper room) {
		super();
		this.bookingId = bookingId;
		this.checkInDate = checkInDate;
		this.checkOutDate = checkOutDate;
		this.guestName = guestName;
		this.guestEmail = guestEmail;
		this.noOfAdults = noOfAdults;
		this.noOfChildren = noOfChildren;
		this.totalGuests = totalGuests;
		this.bookingConfirmationCode = bookingConfirmationCode;
		this.room = room;
	}

	public Long getBookingId() {
		return bookingId;
	}

	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}

	public LocalDate getCheckInDate() {
		return checkInDate;
	}

	public void setCheckInDate(LocalDate checkInDate) {
		this.checkInDate = checkInDate;
	}

	public LocalDate getCheckOutDate() {
		return checkOutDate;
	}

	public void setCheckOutDate(LocalDate checkOutDate) {
		this.checkOutDate = checkOutDate;
	}

	public String getGuestName() {
		return guestName;
	}

	public void setGuestName(String guestName) {
		this.guestName = guestName;
	}

	public String getGuestEmail() {
		return guestEmail;
	}

	public void setGuestEmail(String guestEmail) {
		this.guestEmail = guestEmail;
	}

	public int getNoOfAdults() {
		return noOfAdults;
	}

	public void setNoOfAdults(int noOfAdults) {
		this.noOfAdults = noOfAdults;
	}

	public int getNoOfChildren() {
		return noOfChildren;
	}

	public void setNoOfChildren(int noOfChildren) {
		this.noOfChildren = noOfChildren;
	}

	public int getTotalGuests() {
		return totalGuests;
	}

	public void setTotalGuests(int totalGuests) {
		this.totalGuests = totalGuests;
	}

	public String getBookingConfirmationCode() {
		return bookingConfirmationCode;
	}

	public void setBookingConfirmationCode(String bookingConfirmationCode) {
		this.bookingConfirmationCode = bookingConfirmationCode;
	}

	public HotelRoomWrapper getRoom() {
		return room;
	}

	public void setRoom(HotelRoomWrapper room) {
		this.room = room;
	}

}
