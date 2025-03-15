package com.example.warehouse.service;

import com.example.warehouse.dto.ExportReceiptDTO;
import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.repository.ExportReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExportReceiptService {
    @Autowired
    private ExportReceiptRepository exportReceiptRepository;

    public List<ExportReceiptDTO> getAllExportReceipts() {
        return exportReceiptRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private ExportReceiptDTO convertToDTO(ExportReceipt receipt) {
        ExportReceiptDTO dto = new ExportReceiptDTO();
        dto.setMaPhieu(receipt.getMaPhieu());
        dto.setThoiGianTao(receipt.getThoiGianTao());
        dto.setNguoiTao(receipt.getNguoiTao());
        dto.setTongTien(receipt.getTongTien());
        return dto;
    }
    public double getTotalExportValue() {
        return exportReceiptRepository.findAll().stream()
                .mapToDouble(ExportReceipt::getTongTien)
                .sum();
    }
    public long getTotalExportReceipts() {
        return exportReceiptRepository.count();
    }
}