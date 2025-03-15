package com.example.warehouse.repository;

import com.example.warehouse.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByUserName(String userName);
}