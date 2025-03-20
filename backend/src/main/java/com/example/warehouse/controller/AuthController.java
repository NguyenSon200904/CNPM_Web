package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Lấy userName và password từ request
        String userName = loginRequest.getUserName();
        String password = loginRequest.getPassword();

        // Tìm tài khoản theo userName
        Optional<Account> accountOptional = accountService.findByUserName(userName);

        // Kiểm tra xem tài khoản có tồn tại không
        if (accountOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // Lấy đối tượng Account từ Optional
        Account account = accountOptional.get();

        // Kiểm tra mật khẩu
        if (!account.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // Trả về thông tin tài khoản hoặc token
        return ResponseEntity.ok("Login successful");
    }
}