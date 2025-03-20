package com.example.warehouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class ReceiptDetailId implements Serializable {
    @Column(name = "maPhieu", nullable = false, length = 50)
    private String maPhieu;

    @Column(name = "maSanPham", nullable = false, length = 50)
    private String maSanPham;
}