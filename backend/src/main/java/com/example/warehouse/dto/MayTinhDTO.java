package com.example.warehouse.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true) // Sửa lỗi equals/hashCode
public class MayTinhDTO extends ProductDTO {
    private String tenCpu;
    private Integer congSuatNguon;
    private String dungLuongPin; // Đảm bảo kiểu Integer để khớp với ProductDTO
    private Double kichThuocMan;
    private String loaiMay;
    private String maBoard;
}