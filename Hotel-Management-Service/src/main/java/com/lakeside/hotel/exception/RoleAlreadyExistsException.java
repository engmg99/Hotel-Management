package com.lakeside.hotel.exception;

public class RoleAlreadyExistsException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public RoleAlreadyExistsException(String msg) {
		super(msg);
	}
}
