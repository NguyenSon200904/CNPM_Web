package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ChiTietPhieuXuat")
@Data
public class ExportReceiptDetail {
    @Id
    @ManyToOne
    @JoinColumn(name = "maPhieu")
    private ExportReceipt exportReceipt;

    @Id
    @ManyToOne
    @JoinColumn(name = "maMay")
    private Product product;

    private int soLuong;
    private double donGia;
}