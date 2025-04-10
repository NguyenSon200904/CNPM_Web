package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import com.example.warehouse.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Date;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
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

    @Autowired
    private JavaMailSender mailSender;

    @Value("${admin.email}")
    private String adminEmail; // Email của admin

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        logger.info("Đăng nhập với userName: {}", username);

        String sql = "SELECT password, role FROM account WHERE user_name = ?";
        Map<String, Object> user;
        try {
            user = jdbcTemplate.queryForMap(sql, username);
        } catch (Exception e) {
            logger.error("Lỗi khi kiểm tra thông tin đăng nhập cho userName: {}, lỗi: {}", username, e.getMessage());
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }

        String storedPassword = (String) user.get("password");
        if (passwordEncoder.matches(password, storedPassword)) {
            String role = (String) user.get("role");
            logger.info("Đăng nhập thành công cho userName: {}, role: {}", username, role);
            List<String> roles = Collections.singletonList(role);

            String token = jwtUtil.generateToken(username, roles);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            logger.warn("Mật khẩu không đúng cho userName: {}", username);
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }
    }

    @GetMapping("/auth/me")
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
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy thông tin người dùng hiện tại: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        logger.info("Yêu cầu quên mật khẩu cho userName: {}", username);

        Optional<Account> accountOptional = accountService.findByUserName(username);
        if (accountOptional.isEmpty()) {
            logger.warn("Không tìm thấy tài khoản với userName: {}", username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Không tìm thấy tài khoản với tên đăng nhập này!"));
        }

        Account account = accountOptional.get();

        // Tạo token reset mật khẩu
        String resetToken = jwtUtil.generateResetToken(username);

        // Gửi email đến người dùng
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        SimpleMailMessage userMessage = new SimpleMailMessage();
        userMessage.setTo(account.getEmail());
        userMessage.setSubject("Yêu cầu đặt lại mật khẩu");
        userMessage.setText(
                "Nhấn vào liên kết sau để đặt lại mật khẩu: " + resetLink + "\nLiên kết sẽ hết hạn sau 15 phút.");
        try {
            mailSender.send(userMessage);
            logger.info("Đã gửi email reset mật khẩu đến userName: {}, email: {}", username, account.getEmail());
        } catch (Exception e) {
            logger.error("Lỗi khi gửi email đến userName: {}, email: {}, lỗi: {}", username, account.getEmail(),
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Lỗi khi gửi email. Vui lòng thử lại!"));
        }

        // Gửi thông báo đến admin
        SimpleMailMessage adminMessage = new SimpleMailMessage();
        adminMessage.setTo(adminEmail);
        adminMessage.setSubject("Thông báo: Yêu cầu đặt lại mật khẩu");
        adminMessage.setText("Người dùng " + username + " đã yêu cầu đặt lại mật khẩu vào lúc " + new Date() + ".");
        try {
            mailSender.send(adminMessage);
            logger.info("Đã gửi email thông báo đến admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Lỗi khi gửi email thông báo đến admin: {}, lỗi: {}", adminEmail, e.getMessage(), e);
        }

        return ResponseEntity.ok(
                Collections.singletonMap("message", "Yêu cầu reset mật khẩu đã được gửi! Vui lòng kiểm tra email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        logger.info("Yêu cầu đặt lại mật khẩu với token: {}", token);

        String username;
        try {
            username = jwtUtil.validateResetToken(token);
        } catch (Exception e) {
            logger.error("Token không hợp lệ hoặc đã hết hạn: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Token không hợp lệ hoặc đã hết hạn!"));
        }

        Optional<Account> accountOptional = accountService.findByUserName(username);
        if (accountOptional.isEmpty()) {
            logger.warn("Không tìm thấy tài khoản với userName: {}", username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Không tìm thấy tài khoản!"));
        }

        Account account = accountOptional.get();
        account.setPassword(passwordEncoder.encode(newPassword));
        accountService.save(account);

        logger.info("Đặt lại mật khẩu thành công cho userName: {}", username);
        return ResponseEntity.ok(Collections.singletonMap("message", "Đặt lại mật khẩu thành công!"));
    }
}