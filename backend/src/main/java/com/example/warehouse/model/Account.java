package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Account")
@Data
public class Account {
    @Id
    private String userName;
    private String fullName;
    private String password;
    private String role;
    private Integer status;
    private String email;
}