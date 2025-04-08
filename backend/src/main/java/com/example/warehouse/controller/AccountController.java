package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.service.AccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private AccountService accountService;

    // Lấy tất cả tài khoản
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')") // Chỉ admin hoặc manager được xem danh sách tài khoản
    public ResponseEntity<List<Account>> getAllAccounts() {
        try {
            logger.info("Lấy danh sách tài khoản");
            List<Account> accounts = accountService.findAll();
            if (accounts.isEmpty()) {
                logger.info("Không có tài khoản nào được tìm thấy");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }

            String accountSummary = accounts.stream()
                    .map(account -> "userName=" + account.getUserName() + ", role=" + account.getRole())
                    .collect(Collectors.joining("; "));
            logger.info("Danh sách tài khoản trả về: [{}]", accountSummary);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách tài khoản: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy tài khoản theo userName
    @GetMapping("/{userName}")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<Account> getAccountByUserName(@PathVariable String userName) {
        try {
            logger.info("Lấy tài khoản với userName: {}", userName);
            Optional<Account> accountOptional = accountService.findByUserName(userName);
            if (accountOptional.isEmpty()) {
                logger.warn("Không tìm thấy tài khoản với userName: {}", userName);
                return ResponseEntity.notFound().build();
            }
            Account account = accountOptional.get();
            logger.info("Tài khoản trả về: userName={}, role={}", account.getUserName(), account.getRole());
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy tài khoản với userName {}: {}", userName, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy danh sách tài khoản theo role
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<List<Account>> getAccountsByRole(@PathVariable String role) {
        try {
            logger.info("Lấy danh sách tài khoản với role: {}", role);
            List<Account> accounts = accountService.findByRole(role);
            String accountSummary = accounts.stream()
                    .map(account -> "userName=" + account.getUserName() + ", role=" + account.getRole())
                    .collect(Collectors.joining("; "));
            logger.info("Danh sách tài khoản với role {}: [{}]", role, accountSummary);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách tài khoản với role {}: {}", role, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy danh sách tài khoản theo status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<List<Account>> getAccountsByStatus(@PathVariable Integer status) {
        try {
            logger.info("Lấy danh sách tài khoản với status: {}", status);
            List<Account> accounts = accountService.findByStatus(status);
            String accountSummary = accounts.stream()
                    .map(account -> "userName=" + account.getUserName() + ", role=" + account.getRole())
                    .collect(Collectors.joining("; "));
            logger.info("Danh sách tài khoản với status {}: [{}]", status, accountSummary);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách tài khoản với status {}: {}", status, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Tạo tài khoản mới
    @PostMapping
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        try {
            logger.info("Tạo tài khoản mới: userName={}, role={}", account.getUserName(), account.getRole());
            if (accountService.existsByUserName(account.getUserName())
                    || accountService.existsByEmail(account.getEmail())) {
                logger.warn("Tài khoản hoặc email đã tồn tại: userName={}, email={}", account.getUserName(),
                        account.getEmail());
                return ResponseEntity.badRequest().build();
            }
            Account savedAccount = accountService.save(account);
            logger.info("Tài khoản đã được tạo: userName={}, role={}", savedAccount.getUserName(),
                    savedAccount.getRole());
            return ResponseEntity.status(201).body(savedAccount);
        } catch (Exception e) {
            logger.error("Lỗi khi tạo tài khoản: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Cập nhật tài khoản
    @PutMapping("/{userName}")
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<Account> updateAccount(@PathVariable String userName, @RequestBody Account account) {
        try {
            logger.info("Cập nhật tài khoản với userName: {}", userName);
            if (!accountService.existsByUserName(userName)) {
                logger.warn("Không tìm thấy tài khoản với userName: {}", userName);
                return ResponseEntity.notFound().build();
            }
            account.setUserName(userName);
            Account updatedAccount = accountService.save(account);
            logger.info("Tài khoản đã được cập nhật: userName={}, role={}", updatedAccount.getUserName(),
                    updatedAccount.getRole());
            return ResponseEntity.ok(updatedAccount);
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật tài khoản với userName {}: {}", userName, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Xóa tài khoản
    @DeleteMapping("/{userName}")
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<Void> deleteAccount(@PathVariable String userName) {
        try {
            logger.info("Xóa tài khoản với userName: {}", userName);
            if (!accountService.existsByUserName(userName)) {
                logger.warn("Không tìm thấy tài khoản với userName: {}", userName);
                return ResponseEntity.notFound().build();
            }
            accountService.deleteByUserName(userName);
            logger.info("Tài khoản với userName {} đã được xóa", userName);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Lỗi khi xóa tài khoản với userName {}: {}", userName, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Đặt lại mật khẩu
    @PutMapping("/{userName}/reset-password")
    @PreAuthorize("hasRole('ROLE_Admin')") // Chỉ admin được phép đặt lại mật khẩu
    public ResponseEntity<String> resetPassword(@PathVariable String userName,
            @RequestBody Map<String, String> request) {
        try {
            logger.info("Đặt lại mật khẩu cho userName: {}", userName);
            String newPassword = request.get("password");
            if (newPassword == null || newPassword.isEmpty()) {
                logger.warn("Mật khẩu mới không hợp lệ cho userName: {}", userName);
                return ResponseEntity.badRequest().body("Mật khẩu mới không được để trống!");
            }
            accountService.resetPassword(userName, newPassword);
            logger.info("Đặt lại mật khẩu thành công cho userName: {}", userName);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } catch (Exception e) {
            logger.error("Lỗi khi đặt lại mật khẩu cho userName {}: {}", userName, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đặt lại mật khẩu: " + e.getMessage());
        }
    }
}