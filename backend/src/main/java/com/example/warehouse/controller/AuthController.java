package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<Account> login(@RequestBody LoginRequest loginRequest) {
        Account account = accountService.findByUserName(loginRequest.getUserName());
        if (account == null || !account.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(account);
    }

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<Account> register(@RequestBody Account account) {
        if (accountService.existsByUserName(account.getUserName()) || accountService.existsByEmail(account.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Account savedAccount = accountService.save(account);
        return ResponseEntity.status(201).body(savedAccount);
    }
}

// DTO cho yêu cầu đăng nhập
class LoginRequest {
    private String userName;
    private String password;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}