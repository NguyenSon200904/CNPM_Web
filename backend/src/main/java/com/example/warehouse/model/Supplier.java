package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "nhacungcap")
@Data
public class Supplier {
    @Id
    @Column(name = "maNhaCungCap", nullable = false, length = 50)
    private String maNhaCungCap;

    @Column(name = "tenNhaCungCap", length = 50)
    private String tenNhaCungCap;

    @Column(name = "Sdt", length = 50)
    private String sdt;

    @Column(name = "diaChi", length = 150)
    private String diaChi;

    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Receipt> receipts; // Mối quan hệ với PhieuNhap
}