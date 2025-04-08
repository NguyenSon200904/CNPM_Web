package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import com.example.warehouse.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AccountService accountService;

    @PostMapping("/api/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        logger.info("Đăng nhập với userName: {}", username);

        // Kiểm tra thông tin đăng nhập
        String sql = "SELECT password, role FROM account WHERE user_name = ?";
        Map<String, Object> user;
        try {
            user = jdbcTemplate.queryForMap(sql, username);
        } catch (Exception e) {
            logger.error("Lỗi khi kiểm tra thông tin đăng nhập cho userName: {}, lỗi: {}", username, e.getMessage());
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }

        // So sánh mật khẩu
        String storedPassword = (String) user.get("password");
        if (passwordEncoder.matches(password, storedPassword)) {
            String role = (String) user.get("role");
            logger.info("Đăng nhập thành công cho userName: {}, role: {}", username, role);
            List<String> roles = Collections.singletonList(role); // Tạo danh sách vai trò

            // Tạo token với vai trò
            String token = jwtUtil.generateToken(username, roles);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            logger.warn("Mật khẩu không đúng cho userName: {}", username);
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }
    }

    @GetMapping("/api/auth/me")
    public ResponseEntity<Account> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            logger.info("Lấy thông tin người dùng hiện tại: {}", username);

            Optional<Account> accountOptional = accountService.findByUserName(username);
            if (accountOptional.isEmpty()) {
                logger.warn("Không tìm thấy người dùng: {}", username);
                return ResponseEntity.notFound().build();
            }

            Account account = accountOptional.get();
            logger.info("Người dùng hiện tại: userName={}, role={}", account.getUserName(), account.getRole());

            // Không ánh xạ role thành số, trả về role nguyên bản dưới dạng chuỗi
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy thông tin người dùng hiện tại: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}