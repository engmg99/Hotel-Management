package com.lakeside.hotel.security.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.exception.UserNotFoundException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.repository.UserRepository;

@Service
public class HotelUserDetailsService implements UserDetailsService {

	private static final Logger logger = LoggerFactory.getLogger(HotelUserDetailsService.class);

	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		try {
			logger.info("Inside HotelUserDetailsService loadUserByUsername");
			HotelUser user = userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
			logger.info("user:: " + user);
			logger.info("user:: " + user.getRoles());
			return HotelUserDetails.buildUserDetails(user);
		} catch (BadCredentialsException e) {
			throw new UserNotFoundException("Email don't have an account");
		}
	}

}
