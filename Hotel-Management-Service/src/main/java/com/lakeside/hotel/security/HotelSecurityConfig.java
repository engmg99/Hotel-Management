package com.lakeside.hotel.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.lakeside.hotel.constants.HotelConstants;
import com.lakeside.hotel.security.jwt.AuthTokenFilter;
import com.lakeside.hotel.security.jwt.JWTAuthEntryPoint;
import com.lakeside.hotel.security.user.HotelUserDetailsService;

@Configuration
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class HotelSecurityConfig {

	private static final Logger logger = LoggerFactory.getLogger(HotelSecurityConfig.class);

	@Autowired
	private HotelUserDetailsService userDetailService;
	@Autowired
	private JWTAuthEntryPoint authEntryPoint;

	@Bean
	AuthTokenFilter authenticationTokenFilter() {
		logger.info("Inside HotelSecurityConfig authenticationTokenFilter");
		return new AuthTokenFilter();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		logger.info("Inside HotelSecurityConfig authenticationManager");
		return authConfig.getAuthenticationManager();
	}

	@Bean
	DaoAuthenticationProvider authenticationProvider() {
		logger.info("Inside HotelSecurityConfig authenticationProvider");
		var authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		logger.info("Inside HotelSecurityConfig passwordEncoder");
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		logger.info("Inside HotelSecurityConfig filterChain");
		http.csrf(AbstractHttpConfigurer::disable).exceptionHandling(e -> e.authenticationEntryPoint(authEntryPoint))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.antMatchers(HotelConstants.PUBLIC_API_1, HotelConstants.PUBLIC_API_2,
								HotelConstants.PUBLIC_API_3)
						.permitAll().antMatchers(HotelConstants.PRIVATE_ROLE_API).hasRole(HotelConstants.ADMIN_ROLE)
						.anyRequest().authenticated());
		http.authenticationProvider(authenticationProvider());
		http.addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
