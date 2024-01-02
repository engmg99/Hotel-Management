package com.lakeside.hotel.security.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakeside.hotel.constants.HotelConstants;
import com.lakeside.hotel.exception.InvalidAuthToken;
import com.lakeside.hotel.security.user.HotelUserDetailsService;
import com.lakeside.hotel.utils.SecurityCipher;
import com.lakeside.hotel.wrapper.LoginResponse;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

	@Value("${authentication.auth.accessTokenCookieName}")
	private String accessTokenCookieName;

	@Value("${authentication.auth.refreshTokenCookieName}")
	private String refreshTokenCookieName;

	@Autowired
	private JWTUtils jwtUtils;

	@Autowired
	private HotelUserDetailsService hotelUserDetailService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		logger.info("doFilterInternal Path: " + request.getServletPath());

		if (request.getServletPath().matches("/api/auth/login|/api/auth/v1/refresh|/api/auth/register-user")
				|| matchesPattern(request.getServletPath(), "/room/**")) {
			filterChain.doFilter(request, response);
		} else {
			try {
				final Map<String, Object> body = new HashMap<>();
				final ObjectMapper mapper = new ObjectMapper();
				String JWTToken = getJWT(request, true);
				if (JWTToken != null) {
					Map<String, String> jwtTokenMap = jwtUtils.validateToken(JWTToken);
					if (jwtTokenMap != null && jwtTokenMap.containsKey("validated")
							&& jwtTokenMap.get("validated").equals("true")) {
						String email = jwtUtils.getUserNameFromToken(JWTToken);
						UserDetails userDetails = hotelUserDetailService.loadUserByUsername(email);
						var authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
								userDetails.getAuthorities());
						authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
						SecurityContextHolder.getContext().setAuthentication(authentication);
						logger.info("\nEmail: " + email + "\nUserDeatils: " + userDetails + "\nAuthentication: "
								+ authentication);

						if (request.getServletPath().equals("/api/auth/check-status")) {
							List<String> roles = userDetails.getAuthorities().stream()
									.map(GrantedAuthority::getAuthority).toList();
							body.put("status", LoginResponse.SuccessFailure.SUCCESS);
							body.put("message", "Login successful");
							body.put("email", userDetails.getUsername());
							body.put("roles", roles);
							mapper.writeValue(response.getOutputStream(), body);
						}
						filterChain.doFilter(request, response);
					}
//					else {
//						// access token expired
//						body.put("status", "Invalid Token");
//						String errorMsg = (jwtTokenMap != null && jwtTokenMap.containsKey("validated"))
//								? jwtTokenMap.get("exception")
//								: null;
//						body.put("message", errorMsg);
//						mapper.writeValue(response.getOutputStream(), body);
//					}
				}
			} catch (InvalidAuthToken ex) {
				// this is very important, since it guarantees the user is not authenticated at
				// all
				SecurityContextHolder.clearContext();
				response.sendError(ex.getHttpStatus().value(), ex.getMessage());
				return;
			} catch (Exception e) {
				logger.error("Cannot set user authentication : {} ", e.getMessage());
			}
		}
	}

	private String getJWT(HttpServletRequest request, boolean fromCookie) {
		if (fromCookie)
			return getAccessTokenFromCookie(request);

		return getJWTFromRequest(request);
	}

	private String getJWTFromRequest(HttpServletRequest request) {
		String authHeader = request.getHeader(HotelConstants.AUTH_HEADER);
		if (authHeader != null && authHeader.startsWith(HotelConstants.BEARER)) {
			String accessToken = authHeader.substring(7);
			if (accessToken != null) {
				return SecurityCipher.decrypt(accessToken);
			}
		}
		return null;
	}

	private String getAccessTokenFromCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (accessTokenCookieName.equals(cookie.getName())) {
					String accessToken = cookie.getValue();
					if (accessToken != null) {
						return SecurityCipher.decrypt(accessToken);
					}
				}
			}
		}
		return null;
	}

	private static boolean matchesPattern(String requestPath, String pattern) {
		// Check if the request path starts with the specified pattern
		if (pattern.endsWith("/**")) {
			// If the pattern ends with "/**", check if the request path starts with the
			// pattern excluding "/**"
			String patternWithoutWildCard = pattern.substring(0, pattern.length() - 3);
			return requestPath.startsWith(patternWithoutWildCard);
		} else {
			// Otherwise, directly check if the request path starts with the pattern
			return requestPath.equals(pattern);
		}
	}
}
