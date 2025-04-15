package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired
  private AccountRepository accountRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @GetMapping("/current-user")
  public ResponseEntity<Account> getCurrentUser() {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      if (authentication == null || !authentication.isAuthenticated()) {
        logger.warn("Người dùng chưa đăng nhập!");
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      String username = authentication.getName();
      Optional<Account> accountOpt = accountRepository.findByUserName(username);
      if (accountOpt.isEmpty()) {
        logger.warn("Không tìm thấy người dùng: {}", username);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      return new ResponseEntity<>(accountOpt.get(), HttpStatus.OK);
    } catch (Exception e) {
      logger.error("Lỗi khi lấy thông tin người dùng: {}", e.getMessage(), e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/users/{userName}")
  @Transactional
  public ResponseEntity<Map<String, String>> updateUser(
      @PathVariable String userName,
      @RequestBody Map<String, String> userData) {
    Map<String, String> response = new HashMap<>();
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      if (authentication == null || !authentication.isAuthenticated()) {
        logger.warn("Người dùng chưa đăng nhập!");
        response.put("error", "Người dùng chưa đăng nhập!");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
      }

      String currentUserName = authentication.getName();
      if (!currentUserName.equals(userName)) {
        logger.warn("Người dùng {} không có quyền cập nhật thông tin của {}", currentUserName, userName);
        response.put("error", "Bạn không có quyền cập nhật thông tin của người dùng này!");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
      }

      Optional<Account> accountOpt = accountRepository.findByUserName(userName);
      if (accountOpt.isEmpty()) {
        logger.warn("Không tìm thấy người dùng: {}", userName);
        response.put("error", "Người dùng không tồn tại!");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
      }

      Account account = accountOpt.get();

      String currentPassword = userData.get("password");
      if (currentPassword == null || !passwordEncoder.matches(currentPassword, account.getPassword())) {
        logger.warn("Mật khẩu hiện tại không đúng cho người dùng: {}", userName);
        response.put("error", "Mật khẩu hiện tại không đúng!");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
      }

      String fullName = userData.get("fullName");
      String email = userData.get("email");

      if (fullName != null && !fullName.isEmpty()) {
        account.setFullName(fullName);
      }
      if (email != null && !email.isEmpty()) {
        account.setEmail(email);
      }

      accountRepository.save(account);

      logger.info("Cập nhật thông tin người dùng thành công: {}", userName);
      response.put("message", "Cập nhật thông tin thành công!");
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      logger.error("Lỗi khi cập nhật thông tin người dùng {}: {}", userName, e.getMessage(), e);
      response.put("error", "Lỗi khi cập nhật thông tin: " + e.getMessage());
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/users/{userName}/change-password")
  @Transactional
  public ResponseEntity<Map<String, String>> changePassword(
      @PathVariable String userName,
      @RequestBody Map<String, String> passwordData) {
    Map<String, String> response = new HashMap<>();
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      if (authentication == null || !authentication.isAuthenticated()) {
        logger.warn("Người dùng chưa đăng nhập!");
        response.put("error", "Người dùng chưa đăng nhập!");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
      }

      String currentUserName = authentication.getName();
      if (!currentUserName.equals(userName)) {
        logger.warn("Người dùng {} không có quyền đổi mật khẩu của {}", currentUserName, userName);
        response.put("error", "Bạn không có quyền đổi mật khẩu của người dùng này!");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
      }

      Optional<Account> accountOpt = accountRepository.findByUserName(userName);
      if (accountOpt.isEmpty()) {
        logger.warn("Không tìm thấy người dùng: {}", userName);
        response.put("error", "Người dùng không tồn tại!");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
      }

      Account account = accountOpt.get();

      String currentPassword = passwordData.get("currentPassword");
      if (currentPassword == null || !passwordEncoder.matches(currentPassword, account.getPassword())) {
        logger.warn("Mật khẩu hiện tại không đúng cho người dùng: {}", userName);
        response.put("error", "Mật khẩu hiện tại không đúng!");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
      }

      String newPassword = passwordData.get("newPassword");
      if (newPassword == null || newPassword.length() < 6) {
        logger.warn("Mật khẩu mới không hợp lệ cho người dùng: {}", userName);
        response.put("error", "Mật khẩu mới phải có ít nhất 6 ký tự!");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
      }

      account.setPassword(passwordEncoder.encode(newPassword));
      accountRepository.save(account);

      logger.info("Đổi mật khẩu thành công cho người dùng: {}", userName);
      response.put("message", "Đổi mật khẩu thành công!");
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      logger.error("Lỗi khi đổi mật khẩu cho người dùng {}: {}", userName, e.getMessage(), e);
      response.put("error", "Lỗi khi đổi mật khẩu: " + e.getMessage());
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}