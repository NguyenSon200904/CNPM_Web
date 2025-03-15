package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "PhieuXuat")
@Data
public class ExportReceipt {
    @Id
    private String maPhieu;
    private LocalDateTime thoiGianTao;
    private String nguoiTao;
    private double tongTien;

    @ManyToOne
    @JoinColumn(name = "nguoiTao", insertable = false, updatable = false)
    private Account account;
}