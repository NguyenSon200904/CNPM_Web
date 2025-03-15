package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "PhieuNhap")
@Data
public class Receipt {
    @Id
    private String maPhieu;
    private LocalDateTime thoiGianTao;
    private String nguoiTao;
    private String maNhaCungCap;
    private double tongTien;

    @ManyToOne
    @JoinColumn(name = "nguoiTao", insertable = false, updatable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "maNhaCungCap", insertable = false, updatable = false)
    private Supplier supplier;
}