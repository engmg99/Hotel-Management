package com.lakeside.hotel.controller;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.exception.UserAlreadyExistsException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.JWTResponse;
import com.lakeside.hotel.model.LoginRequest;
import com.lakeside.hotel.security.jwt.JWTUtils;
import com.lakeside.hotel.security.user.HotelUserDetails;
import com.lakeside.hotel.service.HotelUserService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

	@Autowired
	private HotelUserService userService;

	@Autowired
	private AuthenticationManager authManager;

	@Autowired
	private JWTUtils jwtUtils;

	@PostMapping("/register-user")
	public ResponseEntity<?> registerUser(@RequestBody HotelUser user) {
		try {
			userService.registerUser(user);
			return ResponseEntity.ok("Registration Successful!");
		} catch (UserAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (Exception e) {
			logger.error("Exception :: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
		try {
			Authentication authentication = authManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String token = jwtUtils.generateJWTTokenForUser(authentication);
			HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
			List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
			return ResponseEntity.ok(new JWTResponse(userDetails.getId(), userDetails.getEmail(), token, roles));
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Incorrect Password");
		} catch (Exception e) {
			logger.error("Exception :: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}
