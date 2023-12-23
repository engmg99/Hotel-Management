package com.lakeside.hotel.service.impl;

import java.util.Collections;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.exception.UserAlreadyExistsException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.Role;
import com.lakeside.hotel.repository.RoleRepository;
import com.lakeside.hotel.repository.UserRepository;
import com.lakeside.hotel.service.HotelUserService;

@Service
public class HotelUserServiceImpl implements HotelUserService {

	private static final Logger logger = LoggerFactory.getLogger(HotelUserServiceImpl.class);
	
	@Autowired
	private UserRepository userRepo;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public HotelUser registerUser(HotelUser user) {
		if (userRepo.existsByEmail(user.getEmail())) {
			throw new UserAlreadyExistsException(user.getEmail() + " already exists.");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		logger.info("User: "+user);
		Role userRole = roleRepo.findByRole("ROLE_USER").get();
		user.setRoles(Collections.singletonList(userRole));
		return userRepo.save(user);
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

}
