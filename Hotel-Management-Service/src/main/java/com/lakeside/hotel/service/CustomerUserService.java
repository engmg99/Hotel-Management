package com.lakeside.hotel.service;

import java.util.List;

import com.lakeside.hotel.model.HotelUser;

public interface CustomerUserService {

	public HotelUser registerUser(HotelUser user);

	public List<HotelUser> getAllUsers();

	public void deleteUser(String email);

	public HotelUser getUser(String email);
}
