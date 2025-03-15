package com.example.warehouse.service;

import com.example.warehouse.dto.AccountDTO;
import com.example.warehouse.model.Account;
import com.example.warehouse.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public AccountDTO getAccountByUserName(String userName) {
        Account account = accountRepository.findByUserName(userName);
        return account != null ? convertToDTO(account) : null;
    }

    public AccountDTO updateAccount(String userName, AccountDTO accountDTO) {
        Account account = accountRepository.findByUserName(userName);
        if (account != null) {
            account.setFullName(accountDTO.getFullName());
            account.setRole(accountDTO.getRole());
            account.setStatus(accountDTO.getStatus());
            account.setEmail(accountDTO.getEmail());
            accountRepository.save(account);
            return convertToDTO(account);
        }
        return null;
    }

    private AccountDTO convertToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setUserName(account.getUserName());
        dto.setFullName(account.getFullName());
        dto.setRole(account.getRole());
        dto.setStatus(account.getStatus());
        dto.setEmail(account.getEmail());
        return dto;
    }
    public AccountDTO login(String userName, String password) {
      Account account = accountRepository.findByUserName(userName);
      if (account != null && account.getPassword().equals(password)) { // Cần mã hóa password trong thực tế
          return convertToDTO(account);
      }
      return null;
  }
}