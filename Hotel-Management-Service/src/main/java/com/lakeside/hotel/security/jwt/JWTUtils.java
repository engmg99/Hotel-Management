package com.lakeside.hotel.security.jwt;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.lakeside.hotel.exception.InvalidAuthToken;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.security.user.HotelUserDetailsService;
import com.lakeside.hotel.wrapper.UserToken;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtils {
	private static final Logger logger = LoggerFactory.getLogger(JWTUtils.class);

	@Value("${auth.token.jwtSecret}")
	private String jwtSecret;

	@Value("${auth.access.token.expirationInMils}")
	private static long JWT_Access_Expiration_Hours;

	@Value("${auth.refresh.token.expirationInMils}")
	private static long JWT_Refresh_Expiration_Hours;

	@Value("${jwt.cookieExpiry}")
	private int cookieExpiry;

	private static final long ACCESS_EXP_TIME = JWT_Access_Expiration_Hours * 60 * 60 * 1000;
	private static final long REFRESH_EXP_TIME = JWT_Refresh_Expiration_Hours * 60 * 60 * 1000;

	@Autowired
	private HotelUserDetailsService myUserDetails;

	public Authentication getAuthentication(String token) {
		UserDetails userDetails = myUserDetails.loadUserByUsername(getUserNameFromToken(token));
		return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
	}

	public String getUserNameFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
	}

	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
	}

	private Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	public UserToken generateAccessToken(String username) {
		Map<String, Object> claims = new HashMap<>();
		return createAccessToken(claims, username);
	}

	private UserToken createAccessToken(Map<String, Object> claims, String username) {

		Date now = new Date();
		Long duration = now.getTime() + ACCESS_EXP_TIME;
		Instant expiryDate = Instant.now().plusMillis(ACCESS_EXP_TIME);

		String jwtToken = Jwts.builder().setClaims(claims).setSubject(username)
				.setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(Date.from(expiryDate))
				.signWith(getSignKey(), SignatureAlgorithm.HS256).compact();

		UserToken token = new UserToken(UserToken.TokenType.ACCESS, jwtToken, duration, expiryDate);

		return token;
	}

	public UserToken generateRefreshToken(HotelUser user) {
		Claims claims = Jwts.claims().setSubject(user.getEmail());

		claims.put("auth", user.getRoles().stream().map(s -> new SimpleGrantedAuthority(s.getRole()))
				.filter(Objects::nonNull).collect(Collectors.toList()));
		Date now = new Date();
		Long duration = now.getTime() + REFRESH_EXP_TIME;
		Instant expiryDate = Instant.now().plusMillis(REFRESH_EXP_TIME);

		String jwtToken = Jwts.builder().setClaims(claims).setSubject(user.getEmail())
				.setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(Date.from(expiryDate))
				.signWith(getSignKey(), SignatureAlgorithm.HS256).compact();

		UserToken token = new UserToken(UserToken.TokenType.REFRESH, jwtToken, duration, expiryDate);

		return token;
	}

	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
		return Keys.hmacShaKeyFor(keyBytes);
	}

//	public String generateJWTTokenForUser(Authentication auth) {
//		HotelUserDetails userPrincipal = (HotelUserDetails) auth.getPrincipal();
//		List<String> roles = userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
//		return Jwts.builder().setSubject(userPrincipal.getUsername()).claim("roles", roles).setIssuedAt(new Date())
//				.setExpiration(new Date((new Date()).getTime() + JWT_Expiration_Time))
//				.signWith(key(), SignatureAlgorithm.HS256).compact();
//	}

	private Key key() {
		return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
	}

	public Map<String, String> validateToken(String token) {
		Map<String, String> mapToReturn = new HashMap<>();
		try {
			Jwts.parserBuilder().setSigningKey(key()).build().parse(token);
			mapToReturn.put("validated", "true");
		} catch (MalformedJwtException e) {
			logger.error("Invalid JWT Token : {} ", e.getMessage());
			mapToReturn.put("validated", "false");
			mapToReturn.put("exception", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("This token is not supported : {} ", e.getMessage());
			mapToReturn.put("validated", "false");
			mapToReturn.put("exception", e.getMessage());
		} catch (JwtException | IllegalArgumentException e) {
			throw new InvalidAuthToken("Expired or invalid JWT token", HttpStatus.UNAUTHORIZED);
		}
		return mapToReturn;
	}
}
