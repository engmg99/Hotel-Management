package com.lakeside.hotel.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.wrapper.LoginRequest;
import com.lakeside.hotel.wrapper.LoginResponse;

public interface HotelUserService {

	public HotelUser registerUser(HotelUser user);

	public Map<String, Object> login(LoginRequest loginRequest, String accessToken, String refreshToken);

	public Map<String, Object> refreshToken(String accessToken, String refreshToken);

	public LoginResponse logout(HttpServletRequest request, HttpServletResponse response);

	public List<HotelUser> getAllUsers();

	public void deleteUser(String email);

	public HotelUser getUser(String email);
}
