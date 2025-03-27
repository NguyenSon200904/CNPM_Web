package com.example.warehouse.dto;

import com.example.warehouse.model.Account;

public class LoginResponse {
  private String token;
  private Account account;

  public LoginResponse(String token, Account account) {
    this.token = token;
    this.account = account;
  }

  // Getters and setters
  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public Account getAccount() {
    return account;
  }

  public void setAccount(Account account) {
    this.account = account;
  }
}