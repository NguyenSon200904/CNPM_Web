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

        // Sử dụng vai trò trực tiếp từ database (đã có tiền tố ROLE_)
        String role = account.getRole(); // Ví dụ: "ROLE_IMPORTER"

        return new User(
                account.getUserName(),
                account.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role)));
    }
}