package com.example.warehouse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for representing a Receipt (PhieuNhap) with its details.
 */
@Data
public class ReceiptDTO {
    @NotBlank(message = "Receipt code cannot be blank")
    @Size(max = 50, message = "Receipt code must not exceed 50 characters")
    private String maPhieu;

    private LocalDateTime thoiGianTao;

    @Size(max = 50, message = "Creator name must not exceed 50 characters")
    private String nguoiTao;

    @NotBlank(message = "Supplier code cannot be blank")
    private String maNhaCungCap;

    @Min(value = 0, message = "Total amount must be greater than or equal to 0")
    private double tongTien;

    @NotEmpty(message = "Receipt details cannot be empty")
    private List<ReceiptDetailDTO> details;
}