package com.example.warehouse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for representing an ExportReceiptDetail (ChiTietPhieuXuat).
 */
@Data
public class ExportReceiptDetailDTO {
    @NotBlank(message = "Product code cannot be blank")
    @Size(max = 50, message = "Product code must not exceed 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Product code must contain only letters, numbers, and underscores")
    private String maSanPham;

    @Size(max = 20, message = "Product type must not exceed 20 characters")
    @Pattern(regexp = "^(MAY_TINH|DIEN_THOAI)$", message = "Product type must be either MAY_TINH or DIEN_THOAI")
    private String loaiSanPham;

    @Min(value = 1, message = "Quantity must be greater than 0")
    private int soLuong;

    @Min(value = 0, message = "Unit price must be greater than or equal to 0")
    private double donGia;
}