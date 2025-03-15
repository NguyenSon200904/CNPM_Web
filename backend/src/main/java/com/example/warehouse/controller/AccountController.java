package com.example.warehouse.controller;

import com.example.warehouse.dto.AccountDTO;
import com.example.warehouse.dto.LoginRequest;
import com.example.warehouse.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping
    public List<AccountDTO> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/{userName}")
    public AccountDTO getAccountByUserName(@PathVariable String userName) {
        return accountService.getAccountByUserName(userName);
    }

    @PutMapping("/{userName}")
    public AccountDTO updateAccount(@PathVariable String userName, @RequestBody AccountDTO accountDTO) {
        return accountService.updateAccount(userName, accountDTO);
    }

    @PostMapping("/login")
    public AccountDTO login(@RequestBody LoginRequest loginRequest) {
      return accountService.login(loginRequest.getUserName(), loginRequest.getPassword());
    }
}