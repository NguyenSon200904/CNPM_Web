package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Lấy tất cả tài khoản
    @GetMapping
    @PreAuthorize("hasRole('ROLE_Admin') or hasRole('ROLE_Manager')") // Chỉ admin hoặc user được xem danh sách tài khoản
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.findAll();
        return ResponseEntity.ok(accounts);
    }

    // Lấy tài khoản theo userName
    @GetMapping("/{userName}")
    @PreAuthorize("hasRole('ROLE_Admin') or hasRole('ROLE_Manager')")
    public ResponseEntity<Account> getAccountByUserName(@PathVariable String userName) {
        Optional<Account> accountOptional = accountService.findByUserName(userName);
        if (accountOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(accountOptional.get());
    }

    // Lấy danh sách tài khoản theo role
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<Account>> getAccountsByRole(@PathVariable String role) {
        List<Account> accounts = accountService.findByRole(role);
        return ResponseEntity.ok(accounts);
    }

    // Lấy danh sách tài khoản theo status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<Account>> getAccountsByStatus(@PathVariable Integer status) {
        List<Account> accounts = accountService.findByStatus(status);
        return ResponseEntity.ok(accounts);
    }

    // Tạo tài khoản mới
    @PostMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        if (accountService.existsByUserName(account.getUserName())
                || accountService.existsByEmail(account.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Account savedAccount = accountService.save(account);
        return ResponseEntity.status(201).body(savedAccount);
    }

    // Cập nhật tài khoản
    @PutMapping("/{userName}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Account> updateAccount(@PathVariable String userName, @RequestBody Account account) {
        if (!accountService.existsByUserName(userName)) {
            return ResponseEntity.notFound().build();
        }
        account.setUserName(userName);
        Account updatedAccount = accountService.save(account);
        return ResponseEntity.ok(updatedAccount);
    }

    // Xóa tài khoản
    @DeleteMapping("/{userName}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Void> deleteAccount(@PathVariable String userName) {
        if (!accountService.existsByUserName(userName)) {
            return ResponseEntity.notFound().build();
        }
        accountService.deleteByUserName(userName);
        return ResponseEntity.noContent().build();
    }

    // Đặt lại mật khẩu
    @PutMapping("/{userName}/reset-password")
    @PreAuthorize("hasRole('Admin')") // Chỉ admin được phép đặt lại mật khẩu
    public ResponseEntity<String> resetPassword(@PathVariable String userName,
            @RequestBody Map<String, String> request) {
        String newPassword = request.get("password");
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Mật khẩu mới không được để trống!");
        }
        accountService.resetPassword(userName, newPassword);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
    }
}