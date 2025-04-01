package com.example.warehouse.controller;

import com.example.warehouse.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/api/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Kiểm tra thông tin đăng nhập
        String sql = "SELECT password, role FROM account WHERE user_name = ?";
        Map<String, Object> user;
        try {
            user = jdbcTemplate.queryForMap(sql, username);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }

        // So sánh mật khẩu
        String storedPassword = (String) user.get("password");
        if (passwordEncoder.matches(password, storedPassword)) {
            String role = (String) user.get("role");
            List<String> roles = Collections.singletonList(role); // Tạo danh sách vai trò

            // Tạo token với vai trò
            String token = jwtUtil.generateToken(username, roles);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }
    }
}