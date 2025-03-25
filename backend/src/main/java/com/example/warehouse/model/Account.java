package com.example.warehouse.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "account")
@Data
public class Account {
    @Id
    @Column(name = "user_name", length = 50)
    private String userName;

    @Column(name = "email", length = 50)
    private String email;

    @Column(name = "full_name", length = 50)
    private String fullName;

    @Column(name = "password", length = 50, nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    private int role;

    @Column(name = "status")
    private int status;

    @OneToMany(mappedBy = "nguoiTao")
    @JsonIgnore
    private List<Receipt> receipts;
}