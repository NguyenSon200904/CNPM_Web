package com.example.warehouse.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReceiptDTO {
    private String maPhieu;
    private LocalDateTime thoiGianTao;
    private String nguoiTao;
    private String maNhaCungCap;
    private double tongTien;
    private List<ReceiptDetailDTO> details;
}