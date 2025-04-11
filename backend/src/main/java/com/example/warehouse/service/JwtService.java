package com.example.warehouse.service;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  private static final String SECRET_KEY = "8J+5kPqWvXzY2mL9nR4tF7hC3sD6xA=="; // Sử dụng cùng secret với JwtUtil
  private static final long RESET_TOKEN_VALIDITY = 15 * 60 * 1000; // 15 phút

  // Tạo SecretKey từ secret string
  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
  }

  // Sinh token reset mật khẩu
  public String generateResetToken(String username) {
    return Jwts.builder()
        .subject(username)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + RESET_TOKEN_VALIDITY))
        .signWith(getSigningKey())
        .compact();
  }

  // Xác thực token reset mật khẩu
  public String validateResetToken(String token) {
    try {
      return Jwts.parser()
          .verifyWith(getSigningKey())
          .build()
          .parseSignedClaims(token)
          .getPayload()
          .getSubject();
    } catch (Exception e) {
      throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn!");
    }
  }
}