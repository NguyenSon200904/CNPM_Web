package com.example.warehouse.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for representing a DienThoai (phone) product.
 */
@Data
public class DienThoaiDTO extends ProductDTO {
    @Size(max = 20, message = "Operating system must not exceed 20 characters")
    private String heDieuHanh;

    @Size(max = 10, message = "RAM must not exceed 10 characters")
    private String ram;

    @Size(max = 10, message = "Battery capacity must not exceed 10 characters")
    private String dungLuongPin; // Thống nhất kiểu dữ liệu thành String

    @Size(max = 20, message = "Camera resolution must not exceed 20 characters")
    private String doPhanGiaiCamera;

    private Double kichThuocMan;

    @Size(max = 10, message = "ROM must not exceed 10 characters")
    private String rom;

    @Size(max = 20, message = "Chip must not exceed 20 characters")
    private String chip;
}