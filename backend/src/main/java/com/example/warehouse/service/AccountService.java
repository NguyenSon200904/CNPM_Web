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

    // Lấy tài khoản theo userName
    public Account findByUserName(String userName) {
        return accountRepository.findByUserName(userName);
    }

    // Lấy tài khoản theo userName (trả về Optional)
    public Optional<Account> findByUserNameOptional(String userName) {
        return accountRepository.findByUserNameOptional(userName);
    }

    // Lấy tài khoản theo email
    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    // Lấy danh sách tài khoản theo role
    public List<Account> findByRole(String role) {
        return accountRepository.findByRole(role);
    }

    // Lấy danh sách tài khoản theo status
    public List<Account> findByStatus(Integer status) {
        return accountRepository.findByStatus(status);
    }

    // Lấy tất cả tài khoản
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    // Lưu hoặc cập nhật tài khoản
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    // Xóa tài khoản theo userName
    public void deleteByUserName(String userName) {
        accountRepository.deleteById(userName);
    }

    // Kiểm tra xem userName đã tồn tại chưa
    public boolean existsByUserName(String userName) {
        return accountRepository.existsByUserName(userName);
    }

    // Kiểm tra xem email đã tồn tại chưa
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }
}