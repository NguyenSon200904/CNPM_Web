package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieuxuat")
@Data
public class ExportReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_xuat")
    private Long maPhieuXuat;

    @Column(name = "ngay_xuat", nullable = false)
    private LocalDateTime ngayXuat;

    @Column(name = "tong_tien", nullable = false)
    private double tongTien;

    @ManyToOne
    @JoinColumn(name = "nguoi_tao", nullable = false)
    private Account nguoiTao;
}