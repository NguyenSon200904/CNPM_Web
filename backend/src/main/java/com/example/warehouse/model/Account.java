package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "account") // Đổi "Account" thành "account" (theo chuẩn viết thường trong database)
@Data
@EqualsAndHashCode(callSuper = false) // Tắt cảnh báo Lombok
public class Account {
    @Id
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    @Column(name = "full_name", length = 50)
    private String fullName;

    @Column(name = "password", length = 60)
    private String password;

    @Column(name = "role", length = 50)
    private String role;

    @Column(name = "status")
    private Integer status;

    @Column(name = "email", length = 50)
    private String email;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Receipt> receipts;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ExportReceipt> exportReceipts;
}