package com.example.warehouse.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExportReceiptDTO {
    private String maPhieu;
    private LocalDateTime thoiGianTao;
    private String nguoiTao;
    private double tongTien;
    private List<ReceiptDetailDTO> details;
}