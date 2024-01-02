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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.security.user.HotelUserDetailsService;
import com.lakeside.hotel.wrapper.UserToken;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
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

	@Value("${auth.access.token.expiration}")
	private long JWT_Access_Expiration;

	@Value("${auth.refresh.token.expiration}")
	private long JWT_Refresh_Expiration;

	@Value("${jwt.cookieExpiry}")
	private int cookieExpiry;

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

	public Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	public UserToken generateAccessToken(HotelUser user) {
		Claims claims = Jwts.claims().setSubject(user.getEmail());

		claims.put("auth", user.getRoles().stream().map(s -> new SimpleGrantedAuthority(s.getRole()))
				.filter(Objects::nonNull).collect(Collectors.toList()));
		return createAccessToken(claims, user.getEmail());
	}

	private UserToken createAccessToken(Claims claims, String username) {

		Date now = new Date();
		Long duration = now.getTime() + JWT_Access_Expiration;
		Instant expiryDate = Instant.now().plusMillis(JWT_Access_Expiration);

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
		Long duration = now.getTime() + JWT_Refresh_Expiration;
		Instant expiryDate = Instant.now().plusMillis(JWT_Refresh_Expiration);

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
		} catch (ExpiredJwtException e) {
			logger.error("Expired JWT Token : {} ", e.getMessage());
			mapToReturn.put("validated", "false");
			mapToReturn.put("exception", e.getMessage());
		} catch (MalformedJwtException e) {
			logger.error("Invalid JWT Token : {} ", e.getMessage());
			mapToReturn.put("validated", "false");
			mapToReturn.put("exception", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("This token is not supported : {} ", e.getMessage());
			mapToReturn.put("validated", "false");
			mapToReturn.put("exception", e.getMessage());
		} catch (IllegalArgumentException e) {
			logger.error("IllegalArgumentException : {} ", e.getMessage());
			mapToReturn.put("validated", "false");
			mapToReturn.put("exception", e.getMessage());
		}
		return mapToReturn;
	}
}
