package com.example.warehouse.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
  private final String SECRET_KEY = "your-secret-key"; // Thay bằng key bí mật của bạn
  private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 giờ

  public String generateToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
        .compact();
  }

  public String extractUsername(String token) {
    return Jwts.parser()
        .setSigningKey(SECRET_KEY)
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .setSigningKey(SECRET_KEY)
          .parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}