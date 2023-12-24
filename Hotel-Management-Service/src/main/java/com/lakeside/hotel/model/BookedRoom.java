package com.lakeside.hotel.model;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Booked_Rooms")
public class BookedRoom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;

	@Column(name = "checkIn")
	private LocalDate checkInDate;

	@Column(name = "checkOut")
	private LocalDate checkOutDate;

	@Column(name = "guest_name")
	private String guestName;

	@Column(name = "guest_email")
	private String guestEmail;

	@Column(name = "adults")
	private int noOfAdults;

	@Column(name = "children")
	private int noOfChildren;

	@Column(name = "total_guest")
	private int totalGuests;

	@Column(name = "confirmation_code")
	private String bookingConfirmationCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id_fk")
	private HotelRoom room;

	public BookedRoom() {
		super();
	}

	public BookedRoom(LocalDate checkInDate, LocalDate checkOutDate, String guestName, String guestEmail,
			int noOfAdults, int noOfChildren, int totalGuests, String bookingConfirmationCode, HotelRoom room) {
		super();
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
		calcNoOfGuests();
	}

	public int getNoOfChildren() {
		return noOfChildren;
	}

	public void setNoOfChildren(int noOfChildren) {
		this.noOfChildren = noOfChildren;
		calcNoOfGuests();
	}

	public int getTotalGuests() {
		return totalGuests;
	}

	public void calcNoOfGuests() {
		this.totalGuests = this.noOfAdults + this.noOfChildren;
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

	public HotelRoom getRoom() {
		return room;
	}

	public void setRoom(HotelRoom room) {
		this.room = room;
	}

//	@Override
//	public String toString() {
//		return "BookedRoom [bookingId=" + bookingId + ", checkInDate=" + checkInDate + ", checkOutDate=" + checkOutDate
//				+ ", guestName=" + guestName + ", guestEmail=" + guestEmail + ", noOfAdults=" + noOfAdults
//				+ ", noOfChildren=" + noOfChildren + ", totalGuests=" + totalGuests + ", bookingConfirmationCode="
//				+ bookingConfirmationCode + ", room=" + room + "]";
//	}

}
