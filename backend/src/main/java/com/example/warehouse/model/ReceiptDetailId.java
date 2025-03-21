package com.example.warehouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class ReceiptDetailId implements Serializable {
    @Column(name = "ma_phieu_nhap", nullable = false)
    private Long maPhieuNhap;

    @Column(name = "maSanPham", nullable = false, length = 25)
    private String maSanPham;
}