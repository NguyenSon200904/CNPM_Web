package com.example.warehouse.repository;

import com.example.warehouse.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    // Tìm tài khoản theo userName
    Account findByUserName(String userName);

    // Tìm tài khoản theo userName, trả về Optional
    Optional<Account> findByUserNameOptional(String userName);

    // Tìm tài khoản theo email
    Optional<Account> findByEmail(String email);

    // Tìm danh sách tài khoản theo role
    List<Account> findByRole(String role);

    // Tìm danh sách tài khoản theo status
    List<Account> findByStatus(Integer status);

    // Kiểm tra xem userName đã tồn tại chưa
    boolean existsByUserName(String userName);

    // Kiểm tra xem email đã tồn tại chưa
    boolean existsByEmail(String email);
}