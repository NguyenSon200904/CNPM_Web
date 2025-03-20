package com.example.warehouse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for representing common attributes of a Product (MayTinh or DienThoai).
 */
@Data
public class ProductDTO {
    @NotBlank(message = "Product code cannot be blank")
    @Size(max = 50, message = "Product code must not exceed 50 characters")
    private String maSanPham;

    @NotBlank(message = "Product type cannot be blank")
    @Size(max = 20, message = "Product type must not exceed 20 characters")
    private String loaiSanPham; // "MAY_TINH" hoặc "DIEN_THOAI"

    @Size(max = 50, message = "Product name must not exceed 50 characters")
    private String tenSanPham;

    private int soLuong;

    private double gia;

    @Size(max = 50, message = "Origin must not exceed 50 characters")
    private String xuatXu;

    private Integer trangThai;
}