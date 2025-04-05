package com.example.warehouse.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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
    private String loaiSanPham; // "Computer" hoặc "Phone"

    @Size(max = 50, message = "Product name must not exceed 50 characters")
    private String tenSanPham;

    private long soLuongCoTheNhap;

    @JsonDeserialize(using = CustomDoubleDeserializer.class)
    private Double gia; // Sử dụng deserializer tùy chỉnh

    @Size(max = 50, message = "Origin must not exceed 50 characters")
    private String xuatXu;

    private Integer trangThai; // Giữ là Integer

    // Các trường chung
    private String ram;
    private String rom;

    private String dungLuongPin;

    // Các trường cho Điện thoại
    private String heDieuHanh;
    private String doPhanGiaiCamera;
    @JsonDeserialize(using = CustomDoubleDeserializer.class)
    private Double kichThuocMan; // Sử dụng deserializer tùy chỉnh cho kichThuocMan

    // Các trường cho Máy tính
    private String tenCpu;
    private Integer congSuatNguon;
    private String maBoard;
}