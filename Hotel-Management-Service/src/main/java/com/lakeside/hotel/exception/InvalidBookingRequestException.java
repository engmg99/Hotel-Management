package com.lakeside.hotel.exception;

public class InvalidBookingRequestException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidBookingRequestException(String msg) {
		super(msg);
	}
}
