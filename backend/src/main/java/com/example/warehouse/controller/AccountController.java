package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Lấy tất cả tài khoản
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.findAll();
        return ResponseEntity.ok(accounts);
    }

    // Lấy tài khoản theo userName
    @GetMapping("/{userName}")
    public ResponseEntity<Account> getAccountByUserName(@PathVariable String userName) {
        Optional<Account> accountOptional = accountService.findByUserName(userName);
        if (accountOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(accountOptional.get());
    }

    // Lấy danh sách tài khoản theo role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<Account>> getAccountsByRole(@PathVariable String role) {
        List<Account> accounts = accountService.findByRole(role);
        return ResponseEntity.ok(accounts);
    }

    // Lấy danh sách tài khoản theo status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Account>> getAccountsByStatus(@PathVariable Integer status) {
        List<Account> accounts = accountService.findByStatus(status);
        return ResponseEntity.ok(accounts);
    }

    // Tạo tài khoản mới
    @PostMapping
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
    public ResponseEntity<Void> deleteAccount(@PathVariable String userName) {
        if (!accountService.existsByUserName(userName)) {
            return ResponseEntity.notFound().build();
        }
        accountService.deleteByUserName(userName);
        return ResponseEntity.noContent().build();
    }
}