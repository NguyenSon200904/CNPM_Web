package com.example.warehouse.dto;

import lombok.Data;

@Data
public class AccountDTO {
    private String userName;
    private String fullName;
    private String role;
    private Integer status;
    private String email;
}