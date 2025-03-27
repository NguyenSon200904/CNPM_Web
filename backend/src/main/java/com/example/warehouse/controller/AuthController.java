package com.example.warehouse.controller;

import com.example.warehouse.dto.LoginRequest;
import com.example.warehouse.dto.LoginResponse;
import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import com.example.warehouse.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Tìm account theo username
        Account account = accountRepository.findByUserName(loginRequest.getUserName())
                .orElse(null);

        if (account == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Tên đăng nhập hoặc mật khẩu không đúng");
            return ResponseEntity.status(401).body(error);
        }

        // Kiểm tra mật khẩu bằng BCryptPasswordEncoder
        if (!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Tên đăng nhập hoặc mật khẩu không đúng");
            return ResponseEntity.status(401).body(error);
        }

        // Tạo JWT token
        String token = jwtUtil.generateToken(account.getUserName());

        // Trả về token và thông tin account
        return ResponseEntity.ok(new LoginResponse(token, account));
    }
}