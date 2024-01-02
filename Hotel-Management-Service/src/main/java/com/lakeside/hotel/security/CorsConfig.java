package com.lakeside.hotel.security;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.lakeside.hotel.constants.HotelConstants;

@Configuration
@EnableWebMvc
public class CorsConfig {

	private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

	// instead of adding CORS origin to each controller, created this single file
	@Bean
	FilterRegistrationBean<CorsFilter> corsFilter() {
		logger.info("Inside CorsConfig");
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:5173");
		config.setAllowedHeaders(
				Arrays.asList(HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE, "X-XSRF-TOKEN", HttpHeaders.ACCEPT));
		config.setAllowedMethods(Arrays.asList(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.OPTIONS.name(),
				HttpMethod.PUT.name(), HttpMethod.DELETE.name()));
		config.setMaxAge(HotelConstants.MAX_AGE);
		logger.info("config:: " + config);
		source.registerCorsConfiguration("/**", config);
		FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));
		// should be set order to -100 because we need to CorsFilter before SpringSecurityFilter
		bean.setOrder(HotelConstants.CORS_FILTER_ORDER);
		logger.info("bean:: " + bean);
		return bean;
	}
}
