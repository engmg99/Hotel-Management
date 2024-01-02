package com.lakeside.hotel.wrapper;

import java.util.List;

public class LoginResponse {
	private SuccessFailure status;
	private String message;
	private String error;
	private Long id;
	private String email;
	private List<String> roles;

	public enum SuccessFailure {
		SUCCESS, FAILURE
	}

	public LoginResponse() {
		super();
	}

	public LoginResponse(SuccessFailure status, String message) {
		this.status = status;
		this.message = message;
	}
	
	public LoginResponse(SuccessFailure status, String message, String error) {
		super();
		this.status = status;
		this.message = message;
		this.error = error;
	}

	public LoginResponse(SuccessFailure status, String message, String email,
			List<String> roles) {
		super();
		this.status = status;
		this.message = message;
		this.email = email;
		this.roles = roles;
	}
	
	public LoginResponse(SuccessFailure status, String message, Long id, String email,
			List<String> roles) {
		super();
		this.status = status;
		this.message = message;
		this.id = id;
		this.email = email;
		this.roles = roles;
	}

	public SuccessFailure getStatus() {
		return status;
	}

	public void setStatus(SuccessFailure status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

}
