package com.lakeside.hotel.constants;

public class HotelConstants {
	
	public static final String ADMIN_ROLE = "ADMIN";
	public static final String USER_ROLE = "USER";
	
	public static final String PUBLIC_API_1 = "/api/auth/**";
	public static final String PUBLIC_API_2 = "/room/**";
	public static final String PUBLIC_API_3 = "/bookings/**";
	
	public static final String PRIVATE_ROLE_API = "/api/roles/**";
	
	public static final String AUTH_HEADER = "Authorization";
	public static final String BEARER = "Bearer ";
	
	public static final Long MAX_AGE = 3600L;
	public static final int CORS_FILTER_ORDER = -102;
	
}
