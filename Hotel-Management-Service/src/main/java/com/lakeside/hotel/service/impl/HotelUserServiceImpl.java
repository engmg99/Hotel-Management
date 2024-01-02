package com.lakeside.hotel.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.exception.UserAlreadyExistsException;
import com.lakeside.hotel.exception.UserNotFoundException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.Role;
import com.lakeside.hotel.repository.RoleRepository;
import com.lakeside.hotel.repository.UserRepository;
import com.lakeside.hotel.security.jwt.JWTUtils;
import com.lakeside.hotel.service.HotelUserService;
import com.lakeside.hotel.utils.CookieUtils;
import com.lakeside.hotel.wrapper.LoginRequest;
import com.lakeside.hotel.wrapper.LoginResponse;
import com.lakeside.hotel.wrapper.UserToken;

@Service
public class HotelUserServiceImpl implements HotelUserService {

	private static final Logger logger = LoggerFactory.getLogger(HotelUserServiceImpl.class);

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JWTUtils jwtUtils;

	@Autowired
	private CookieUtils cookieUtils;

	@Value("${authentication.auth.accessTokenCookieName}")
	private String accessTokenCookieName;

	@Value("${authentication.auth.refreshTokenCookieName}")
	private String refreshTokenCookieName;

	@Override
	public HotelUser registerUser(HotelUser user) {
		if (userRepo.existsByEmail(user.getEmail())) {
			throw new UserAlreadyExistsException(user.getEmail() + " already exists.");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		logger.info("User: " + user);
		Role userRole = roleRepo.findByRole("ROLE_USER").get();
		user.setRoles(Collections.singletonList(userRole));
		return userRepo.save(user);
	}

	@Override
	public Map<String, Object> login(LoginRequest loginRequest, String accessToken, String refreshToken) {
		Map<String, Object> mapToReturn = new HashMap<>();
		Boolean isAccessTokenValid = null, isRefreshTokenValid = null;
		UserToken newAccessToken, newRefreshToken;

		HttpHeaders responseHeaders = new HttpHeaders();

		String email = loginRequest.getEmail();
		HotelUser user = userRepo.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("User not found with email " + email));

		// when user logs in first time both access and refresh would be null
		// so generate new tokens
		if (accessToken == null && refreshToken == null) {
			newAccessToken = jwtUtils.generateAccessToken(user);
			newRefreshToken = jwtUtils.generateRefreshToken(user);
			addAccessTokenCookie(responseHeaders, newAccessToken);
			addRefreshTokenCookie(responseHeaders, newRefreshToken);
		}

		// when user logs in when both access and refresh tokens are expired
		// so generate new tokens
		if (accessToken != null && !accessToken.isEmpty() && !accessToken.isBlank()) {
			Map<String, String> jwtTokenMap = jwtUtils.validateToken(accessToken);
			isAccessTokenValid = Boolean.parseBoolean(jwtTokenMap.get("validated"));
		}
		if (refreshToken != null && !refreshToken.isEmpty() && !refreshToken.isBlank()) {
			Map<String, String> jwtTokenMap = jwtUtils.validateToken(refreshToken);
			isRefreshTokenValid = Boolean.parseBoolean(jwtTokenMap.get("validated"));
		}
		if (isAccessTokenValid != null && !isAccessTokenValid && isRefreshTokenValid != null && !isRefreshTokenValid) {
			newAccessToken = jwtUtils.generateAccessToken(user);
			newRefreshToken = jwtUtils.generateRefreshToken(user);
			addAccessTokenCookie(responseHeaders, newAccessToken);
			addRefreshTokenCookie(responseHeaders, newRefreshToken);
		}
		mapToReturn.put("httpHeaders", responseHeaders);
		return mapToReturn;
	}

	@Override
	public Map<String, Object> refreshToken(String accessToken, String refreshToken) {
		Map<String, Object> mapToReturn = new HashMap<>();
		Map<String, String> jwtTokenMap = jwtUtils.validateToken(refreshToken);
		if (!Boolean.parseBoolean(jwtTokenMap.get("validated"))) {
			LoginResponse loginResponse = new LoginResponse(LoginResponse.SuccessFailure.FAILURE,
					"Invalid Refresh Token");
			mapToReturn.put("loginResponse", loginResponse);
			return mapToReturn;
		}
		String username = jwtUtils.getUserNameFromToken(refreshToken);
		HotelUser user = getUser(username);
		UserToken newAccessToken = jwtUtils.generateAccessToken(user);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.add(HttpHeaders.SET_COOKIE, cookieUtils
				.createAccessTokenCookie(newAccessToken.getTokenValue(), newAccessToken.getDuration()).toString());
		mapToReturn.put("httpHeaders", responseHeaders);
		LoginResponse loginResponse = new LoginResponse(LoginResponse.SuccessFailure.SUCCESS,
				"Auth successful. Tokens are created in cookie.");
		mapToReturn.put("loginResponse", loginResponse);
		return mapToReturn;
	}

	@Override
	public LoginResponse logout(HttpServletRequest request, HttpServletResponse response) {
		SecurityContextHolder.clearContext();
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if (cookie.getName().equals(accessTokenCookieName) || cookie.getName().equals(refreshTokenCookieName)) {
					cookie.setMaxAge(0);
					cookie.setValue("");
					cookie.setHttpOnly(true);
					cookie.setPath("/");
					response.addCookie(cookie);
				}
			}
		}
		return new LoginResponse(LoginResponse.SuccessFailure.SUCCESS, "Logout Successfully.");
	}

	@Override
	public List<HotelUser> getAllUsers() {
		return userRepo.findAll();
	}

	@Override
	@Transactional
	public void deleteUser(String email) {
		HotelUser user = getUser(email);
		if (user != null) {
			userRepo.deleteByEmail(user.getEmail());
		}
	}

	@Override
	public HotelUser getUser(String email) {
		return userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	private void addAccessTokenCookie(HttpHeaders httpHeaders, UserToken token) {
		httpHeaders.add(HttpHeaders.SET_COOKIE,
				cookieUtils.createAccessTokenCookie(token.getTokenValue(), token.getDuration()).toString());
	}

	private void addRefreshTokenCookie(HttpHeaders httpHeaders, UserToken token) {
		httpHeaders.add(HttpHeaders.SET_COOKIE,
				cookieUtils.createRefreshTokenCookie(token.getTokenValue(), token.getDuration()).toString());
	}

}
