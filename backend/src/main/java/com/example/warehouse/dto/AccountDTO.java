package com.example.warehouse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountDTO {
    @Size(max = 50, message = "Username must not exceed 50 characters")
    private String userName;

    @Size(max = 50, message = "Full name must not exceed 50 characters")
    private String fullName;

    @Size(max = 20, message = "Role must not exceed 20 characters")
    private String role;

    private Integer status;

    @Email(message = "Email must be a valid email address")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    private String email;
}