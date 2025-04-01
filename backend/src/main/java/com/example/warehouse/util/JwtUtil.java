package com.example.warehouse.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

  private String secret = "8J+5kPqWvXzY2mL9nR4tF7hC3sD6xA=="; // Thay bằng secret key của bạn

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public List<String> extractRoles(String token) {
    return extractClaim(token, claims -> claims.get("roles", List.class));
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser()
        .setSigningKey(secret)
        .parseClaimsJws(token)
        .getBody();
  }

  public boolean validateToken(String token) {
    try {
      return !extractExpiration(token).before(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  // Tạo token với vai trò dưới dạng string
  public String generateToken(String username, List<String> roles) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("roles", roles); // Vai trò là List<String>
    return createToken(claims, username);
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 giờ
        .signWith(SignatureAlgorithm.HS256, secret)
        .compact();
  }
}