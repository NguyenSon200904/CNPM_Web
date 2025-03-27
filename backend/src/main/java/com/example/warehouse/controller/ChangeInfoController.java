package com.example.warehouse.controller;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChangeInfoController {

  @Autowired
  private AccountRepository accountRepository;

  @GetMapping("/current-user")
  public ResponseEntity<?> getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    Account account = accountRepository.findByUserName(username)
        .orElse(null);
    if (account == null) {
      return ResponseEntity.status(404).body("User not found");
    }
    return ResponseEntity.ok(account);
  }
}