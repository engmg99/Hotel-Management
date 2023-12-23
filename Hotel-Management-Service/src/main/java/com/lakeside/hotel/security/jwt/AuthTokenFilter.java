package com.lakeside.hotel.security.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.lakeside.hotel.constants.HotelConstants;
import com.lakeside.hotel.security.user.HotelUserDetailsService;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

	@Autowired
	private JWTUtils utils;

	@Autowired
	private HotelUserDetailsService hotelUserDetailService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		logger.info("Inside AuthTokenFilter doFilterInternal");
		try {
			String jwt = parseJWT(request);
			logger.info("JWT Token From Header: " + jwt);
			if (jwt != null && utils.validateToken(jwt)) {
				String email = utils.getUserNameFromToken(jwt);
				logger.info("email: " + email);
				UserDetails userDetails = hotelUserDetailService.loadUserByUsername(email);
				logger.info("userDetails: " + userDetails);
				var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				logger.info("authentication: " + authentication);
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		} catch (Exception e) {
			logger.error("Cannot set user authentication : {} ", e.getMessage());
		}
		logger.info("request:: "+request);
		logger.info("response:: "+response);
		filterChain.doFilter(request, response);

	}

	private String parseJWT(HttpServletRequest request) {
		String authHeader = request.getHeader(HotelConstants.AUTH_HEADER);
		if (authHeader != null && authHeader.startsWith(HotelConstants.BEARER)) {
			return authHeader.substring(7);
		}
		return null;
	}

}
