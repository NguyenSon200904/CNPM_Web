package com.example.warehouse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupplierDTO {
    @NotBlank(message = "Supplier code cannot be blank")
    @Size(max = 50, message = "Supplier code must not exceed 50 characters")
    private String maNhaCungCap;

    @Size(max = 50, message = "Supplier name must not exceed 50 characters")
    private String tenNhaCungCap;

    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must contain only digits and have 10-15 characters")
    private String sdt;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String diaChi;
}