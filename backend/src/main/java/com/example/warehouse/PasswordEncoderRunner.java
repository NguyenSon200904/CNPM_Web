package com.example.warehouse;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderRunner implements CommandLineRunner {

  @Autowired
  private AccountRepository accountRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
    // Lấy tất cả account từ bảng account
    Iterable<Account> accounts = accountRepository.findAll();
    for (Account account : accounts) {
      String rawPassword = account.getPassword();
      // Kiểm tra nếu mật khẩu chưa được mã hóa (plaintext)
      if (rawPassword != null && !rawPassword.startsWith("$2a$")) {
        String encodedPassword = passwordEncoder.encode(rawPassword);
        account.setPassword(encodedPassword);
        accountRepository.save(account);
        System.out.println("Encoded password for account " + account.getUserName() + ": " + encodedPassword);
      }
    }
  }
}