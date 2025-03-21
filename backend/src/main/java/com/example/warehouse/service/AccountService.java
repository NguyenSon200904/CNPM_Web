package com.example.warehouse.service;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // Lấy tất cả tài khoản
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    // Tìm tài khoản theo userName
    public Optional<Account> findByUserName(String userName) {
        return accountRepository.findByUserName(userName);
    }

    // Tìm tài khoản theo email
    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    // Tìm danh sách tài khoản theo role
    public List<Account> findByRole(int role) {
        return accountRepository.findByRole(role);
    }

    // Tìm danh sách tài khoản theo status
    public List<Account> findByStatus(Integer status) {
        return accountRepository.findByStatus(status);
    }

    // Kiểm tra xem userName đã tồn tại chưa
    public boolean existsByUserName(String userName) {
        return accountRepository.existsByUserName(userName);
    }

    // Kiểm tra xem email đã tồn tại chưa
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    // Lưu hoặc cập nhật tài khoản
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    // Xóa tài khoản theo userName
    public void deleteByUserName(String userName) {
        accountRepository.deleteById(userName);
    }
}