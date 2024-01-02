package com.lakeside.hotel.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.exception.UserAlreadyExistsException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.security.user.HotelUserDetails;
import com.lakeside.hotel.service.HotelUserService;
import com.lakeside.hotel.utils.SecurityCipher;
import com.lakeside.hotel.wrapper.LoginRequest;
import com.lakeside.hotel.wrapper.LoginResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

	@Autowired
	private HotelUserService hotelUserService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@PostMapping("/register-user")
	public ResponseEntity<?> registerUser(@RequestBody HotelUser user) {
		try {
			hotelUserService.registerUser(user);
			return ResponseEntity.ok("Registration Successful!");
		} catch (UserAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (Exception e) {
			logger.error("Exception :: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
			@CookieValue(name = "AuthToken", required = false) String accessToken,
			@CookieValue(name = "RefreshToken", required = false) String refreshToken, HttpServletRequest request,
			HttpServletResponse response) {
		try {
			HttpHeaders responseHeaders = new HttpHeaders();
			String decryptedAccessToken = null;
			String decryptedRefreshToken = null;
			if (accessToken != null) {
				decryptedAccessToken = SecurityCipher.decrypt(accessToken);
			}
			if (refreshToken != null) {
				decryptedRefreshToken = SecurityCipher.decrypt(refreshToken);

			}
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
			HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
			List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
			SecurityContextHolder.getContext().setAuthentication(authentication);
			Map<String, Object> resultMap = hotelUserService.login(loginRequest, decryptedAccessToken,
					decryptedRefreshToken);
			if (resultMap != null && resultMap.containsKey("httpHeaders")) {
				responseHeaders = (HttpHeaders) resultMap.get("httpHeaders");
			}
			LoginResponse loginResponse = new LoginResponse(LoginResponse.SuccessFailure.SUCCESS, "Login successful",
					userDetails.getId(), userDetails.getEmail(), roles);
			return ResponseEntity.ok().headers(responseHeaders).body(loginResponse);
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect Password");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("invalid user request..!!");
		} catch (Exception e) {
			logger.error("Exception :: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

//	@PostMapping("v1/refresh")
//	public JWTResponse refreshJwtToken(@RequestBody LoginRequest request, HttpServletResponse response) {
//		try {
//			Authentication authentication = authenticationManager
//					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
//			if (authentication.isAuthenticated()) {
//				HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
//				List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
//				RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());
//				HotelUser user = refreshToken.getUser();
//				String newAccessToken = jwtUtils.generateAccessToken(user.getEmail()).getTokenValue();
//				return new JWTResponse(userDetails.getId(), userDetails.getEmail(), newAccessToken,
//						refreshToken.getRefreshToken(), roles);
//			}
//		} catch (Exception e) {
//			logger.error(e.getMessage());
//			throw new UsernameNotFoundException("invalid user request..!!");
//		}
//		return null;
//	}

	@GetMapping(value = "/v1/refresh", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> refreshToken(@CookieValue(name = "AuthToken", required = false) String accessToken,
			@CookieValue(name = "RefreshToken", required = false) String refreshToken) {
		try {
			HttpHeaders responseHeaders = new HttpHeaders();
			String decryptedAccessToken = null;
			String decryptedRefreshToken = null;
			if (accessToken != null) {
				decryptedAccessToken = SecurityCipher.decrypt(accessToken);
			}
			if (refreshToken != null) {
				decryptedRefreshToken = SecurityCipher.decrypt(refreshToken);

			}
			Map<String, Object> result = hotelUserService.refreshToken(decryptedAccessToken, decryptedRefreshToken);
			LoginResponse loginResponse = (result != null && result.containsKey("loginResponse"))
					? (LoginResponse) result.get("loginResponse")
					: null;
			if (result != null && result.containsKey("httpHeaders")) {
				responseHeaders = (HttpHeaders) result.get("httpHeaders");
			}
			return ResponseEntity.ok().headers(responseHeaders).body(loginResponse);
		} catch (Exception e) {
//			logger.error("Refresh Token Exception :: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@GetMapping("/logout")
	public ResponseEntity<?> logOut(HttpServletRequest request, HttpServletResponse response) {
		try {
			LoginResponse result = hotelUserService.logout(request, response);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			logger.error("Logout Exception :: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@GetMapping("/check-status")
	public void checkStatus() {
		logger.info("Validating User Session");
	}
}
