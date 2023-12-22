package com.lakeside.hotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.exception.UserAlreadyExistsException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.service.CustomerUserService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

	@Autowired
	private CustomerUserService userService;

	@PostMapping("/register-user")
	public ResponseEntity<?> registerUser(HotelUser user) {
		try {
			userService.registerUser(user);
			return ResponseEntity.ok("Registration Successful!");
		} catch (UserAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}
