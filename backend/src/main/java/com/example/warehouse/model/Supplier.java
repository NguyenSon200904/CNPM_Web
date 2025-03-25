package com.example.warehouse.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nhacungcap")
@Data
public class Supplier {
    @Id
    @Column(name = "maNhaCungCap", length = 50)
    private String maNhaCungCap;

    @Column(name = "tenNhaCungCap", length = 50)
    private String tenNhaCungCap;

    @Column(name = "diaChi", length = 150)
    private String diaChi;

    @Column(name = "sdt", length = 50)
    private String sdt;

    @OneToMany(mappedBy = "nhaCungCap")
    @JsonIgnore
    private List<Receipt> receipts;
}