package com.lakeside.hotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.service.CustomerUserService;

@RestController
@RequestMapping("/api/user")
public class HotelUserController {

	@Autowired
	private CustomerUserService userService;

	@GetMapping("/all-users")
	public ResponseEntity<List<HotelUser>> getUsers() {
		return new ResponseEntity<List<HotelUser>>(userService.getAllUsers(), HttpStatus.FOUND);
	}

	@GetMapping("/{email}")
	public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
		try {
			HotelUser user = userService.getUser(email);
			return ResponseEntity.ok(user);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@DeleteMapping("/delete/{email}")
	public ResponseEntity<String> deleteUser(@PathVariable("email") String email) {
		try {
			userService.deleteUser(email);
			return ResponseEntity.ok("User deleted successfully");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}
