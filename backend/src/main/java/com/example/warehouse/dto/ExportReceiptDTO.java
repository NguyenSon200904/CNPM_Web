package com.example.warehouse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for representing an ExportReceipt (PhieuXuat) with its details.
 */
@Data
public class ExportReceiptDTO {
    @NotBlank(message = "Receipt code cannot be blank")
    @Size(max = 50, message = "Receipt code must not exceed 50 characters")
    private String maPhieu;

    private LocalDateTime thoiGianTao;

    private AccountDTO account; // Thay nguoiTao (String) bằng AccountDTO

    @Min(value = 0, message = "Total amount must be greater than or equal to 0")
    private double tongTien;

    @NotEmpty(message = "Export receipt details cannot be empty")
    private List<ExportReceiptDetailDTO> details;
}