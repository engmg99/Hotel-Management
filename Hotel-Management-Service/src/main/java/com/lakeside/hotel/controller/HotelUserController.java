package com.lakeside.hotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.service.HotelUserService;

@RestController
@RequestMapping("/api/user")
public class HotelUserController {

	@Autowired
	private HotelUserService userService;

	@GetMapping("/all-users")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<HotelUser>> getUsers() {
		return new ResponseEntity<List<HotelUser>>(userService.getAllUsers(), HttpStatus.FOUND);
	}

	@GetMapping("/find/{email}")
	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
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
	@PreAuthorize("hasRole('ROLE_ADMIN') or (hasRole('ROLE_USER') and #email == principal.username)")
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
