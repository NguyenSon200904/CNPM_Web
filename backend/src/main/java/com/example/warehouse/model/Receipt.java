package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieunhap")
@Data
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_nhap")
    private Long maPhieuNhap;

    @Column(name = "ngay_nhap", nullable = false)
    private LocalDateTime ngayNhap;

    @Column(name = "tong_tien", nullable = false)
    private double tongTien;

    @ManyToOne
    @JoinColumn(name = "nguoi_tao", nullable = false)
    private Account nguoiTao;
}