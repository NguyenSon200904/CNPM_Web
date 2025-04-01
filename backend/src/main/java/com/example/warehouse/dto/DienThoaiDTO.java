package com.example.warehouse.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true) // Sửa lỗi equals/hashCode
public class DienThoaiDTO extends ProductDTO {
    private String heDieuHanh;
    private String doPhanGiaiCamera;
    private String dungLuongPin; // Đảm bảo kiểu Integer để khớp với ProductDTO
    private Double kichThuocMan;
    private String tenDienThoai;
}