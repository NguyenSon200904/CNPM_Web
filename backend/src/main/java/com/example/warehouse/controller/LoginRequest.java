package com.example.warehouse.controller;

public class LoginRequest {
  private String userName;
  private String password;

  // Constructor mặc định
  public LoginRequest() {
  }

  // Constructor có tham số
  public LoginRequest(String userName, String password) {
    this.userName = userName;
    this.password = password;
  }

  // Getter và Setter
  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}