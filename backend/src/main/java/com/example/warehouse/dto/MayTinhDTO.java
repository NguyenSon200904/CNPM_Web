package com.example.warehouse.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for representing a MayTinh (computer) product.
 */
@Data
public class MayTinhDTO extends ProductDTO {
    @Size(max = 50, message = "CPU name must not exceed 50 characters")
    private String tenCpu;

    @Size(max = 10, message = "RAM must not exceed 10 characters")
    private String ram;

    @Size(max = 50, message = "Graphics card must not exceed 50 characters")
    private String cardManHinh;

    @Size(max = 50, message = "Mainboard must not exceed 50 characters")
    private String mainBoard;

    private Integer congSuatNguon;

    @Size(max = 20, message = "Machine type must not exceed 20 characters")
    private String loaiMay;

    @Size(max = 10, message = "ROM must not exceed 10 characters")
    private String rom;

    private Double kichThuocMan;

    @Size(max = 10, message = "Battery capacity must not exceed 10 characters")
    private String dungLuongPin;
}