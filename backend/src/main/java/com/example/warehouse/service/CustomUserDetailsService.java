package com.example.warehouse.service;

import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  @Autowired
  private AccountRepository accountRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Account account = accountRepository.findByUserName(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

    // Ánh xạ vai trò từ VARCHAR thành ROLE_<role>
    String role = "ROLE_" + account.getRole(); // Ví dụ: "Admin" -> "ROLE_Admin"

    return new User(
        account.getUserName(),
        account.getPassword(),
        Collections.singletonList(new SimpleGrantedAuthority(role)));
  }
}