package com.example.warehouse.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

  private static final String SECRET_KEY = "8J+5kPqWvXzY2mL9nR4tF7hC3sD6xA=="; // Sử dụng cùng secret với JwtUtil
  private static final long RESET_TOKEN_VALIDITY = 15 * 60 * 1000; // 15 phút

  // Sinh token reset mật khẩu
  public String generateResetToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + RESET_TOKEN_VALIDITY))
        .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Sử dụng HS256 và secret dạng String
        .compact();
  }

  // Xác thực token reset mật khẩu
  public String validateResetToken(String token) {
    try {
      return Jwts.parser()
          .setSigningKey(SECRET_KEY)
          .parseClaimsJws(token)
          .getBody()
          .getSubject();
    } catch (Exception e) {
      throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn!");
    }
  }
}