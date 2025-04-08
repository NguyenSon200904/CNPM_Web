package com.example.warehouse.service;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<Account> findAll() {
        logger.info("Lấy danh sách tất cả tài khoản từ repository");
        List<Account> accounts = accountRepository.findAll();
        // Log chỉ userName và role để tránh LazyInitializationException
        String accountSummary = accounts.stream()
                .map(account -> "userName=" + account.getUserName() + ", role=" + account.getRole())
                .collect(Collectors.joining("; "));
        logger.info("Danh sách tài khoản: [{}]", accountSummary);
        return accounts;
    }

    public Optional<Account> findByUserName(String userName) {
        logger.info("Tìm tài khoản với userName: {}", userName);
        Optional<Account> account = accountRepository.findByUserName(userName);
        if (account.isPresent()) {
            Account acc = account.get();
            logger.info("Tài khoản tìm thấy: userName={}, role={}", acc.getUserName(), acc.getRole());
        } else {
            logger.warn("Không tìm thấy tài khoản với userName: {}", userName);
        }
        return account;
    }

    public Optional<Account> findByEmail(String email) {
        logger.info("Tìm tài khoản với email: {}", email);
        Optional<Account> account = accountRepository.findByEmail(email);
        if (account.isPresent()) {
            Account acc = account.get();
            logger.info("Tài khoản tìm thấy: userName={}, role={}", acc.getUserName(), acc.getRole());
        } else {
            logger.warn("Không tìm thấy tài khoản với email: {}", email);
        }
        return account;
    }

    public List<Account> findByRole(String role) {
        logger.info("Tìm tài khoản với role: {}", role);
        List<Account> accounts = accountRepository.findByRole(role);
        String accountSummary = accounts.stream()
                .map(account -> "userName=" + account.getUserName() + ", role=" + account.getRole())
                .collect(Collectors.joining("; "));
        logger.info("Danh sách tài khoản với role {}: [{}]", role, accountSummary);
        return accounts;
    }

    public List<Account> findByStatus(Integer status) {
        logger.info("Tìm tài khoản với status: {}", status);
        List<Account> accounts = accountRepository.findByStatus(status);
        String accountSummary = accounts.stream()
                .map(account -> "userName=" + account.getUserName() + ", role=" + account.getRole())
                .collect(Collectors.joining("; "));
        logger.info("Danh sách tài khoản với status {}: [{}]", status, accountSummary);
        return accounts;
    }

    public boolean existsByUserName(String userName) {
        boolean exists = accountRepository.existsByUserName(userName);
        logger.info("Kiểm tra userName {} tồn tại: {}", userName, exists);
        return exists;
    }

    public boolean existsByEmail(String email) {
        boolean exists = accountRepository.existsByEmail(email);
        logger.info("Kiểm tra email {} tồn tại: {}", email, exists);
        return exists;
    }

    @Transactional
    public Account save(Account account) {
        logger.info("Lưu tài khoản: userName={}, role={}", account.getUserName(), account.getRole());
        if (account.getPassword() != null && !account.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(account.getPassword()));
            logger.info("Mã hóa mật khẩu cho tài khoản: {}", account.getUserName());
        }
        Account savedAccount = accountRepository.save(account);
        logger.info("Tài khoản đã được lưu: userName={}, role={}", savedAccount.getUserName(), savedAccount.getRole());
        return savedAccount;
    }

    @Transactional
    public void deleteByUserName(String userName) {
        logger.info("Xóa tài khoản với userName: {}", userName);
        accountRepository.deleteById(userName);
        logger.info("Tài khoản với userName {} đã được xóa", userName);
    }

    @Transactional
    public void resetPassword(String userName, String newPassword) {
        logger.info("Đặt lại mật khẩu cho userName: {}", userName);
        Optional<Account> accountOptional = accountRepository.findByUserName(userName);
        if (accountOptional.isEmpty()) {
            logger.error("Tài khoản với userName {} không tồn tại", userName);
            throw new RuntimeException("Tài khoản không tồn tại!");
        }
        Account account = accountOptional.get();
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        logger.info("Đặt lại mật khẩu thành công cho userName: {}", userName);
    }
}