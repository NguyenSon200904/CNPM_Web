package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ChiTietPhieuNhap")
@Data
public class ReceiptDetail {
    @Id
    @ManyToOne
    @JoinColumn(name = "maPhieu")
    private Receipt receipt;

    @Id
    @ManyToOne
    @JoinColumn(name = "maMay")
    private Product product;

    private int soLuong;
    private double donGia;
}