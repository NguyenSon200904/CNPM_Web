package com.example.warehouse.service;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<Account> findAll() {
        List<Account> accounts = accountRepository.findAll();
        accounts.forEach(this::mapRoleToNumber); // Ánh xạ role thành số
        return accounts;
    }

    public Optional<Account> findByUserName(String userName) {
        Optional<Account> account = accountRepository.findByUserName(userName);
        account.ifPresent(this::mapRoleToNumber);
        return account;
    }

    public Optional<Account> findByEmail(String email) {
        Optional<Account> account = accountRepository.findByEmail(email);
        account.ifPresent(this::mapRoleToNumber);
        return account;
    }

    public List<Account> findByRole(String role) {
        return accountRepository.findByRole(role);
    }

    public List<Account> findByStatus(Integer status) {
        return accountRepository.findByStatus(status);
    }

    public boolean existsByUserName(String userName) {
        return accountRepository.existsByUserName(userName);
    }

    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    @Transactional
    public Account save(Account account) {
        if (account.getPassword() != null && !account.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(account.getPassword()));
        }
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteByUserName(String userName) {
        accountRepository.deleteById(userName);
    }

    @Transactional
    public void resetPassword(String userName, String newPassword) {
        Optional<Account> accountOptional = accountRepository.findByUserName(userName);
        if (accountOptional.isEmpty()) {
            throw new RuntimeException("Tài khoản không tồn tại!");
        }
        Account account = accountOptional.get();
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

    private void mapRoleToNumber(Account account) {
        String roleStr = account.getRole();
        int roleNumber;
        switch (roleStr) {
            case "Admin":
                roleNumber = 0;
                break;
            case "Nhân viên nhập kho":
                roleNumber = 1;
                break;
            case "Nhân viên xuất kho":
                roleNumber = 2;
                break;
            case "Quản lý kho":
                roleNumber = 3;
                break;
            default:
                roleNumber = 0; // Mặc định là Admin
        }
        account.setRole(String.valueOf(roleNumber));
    }
}