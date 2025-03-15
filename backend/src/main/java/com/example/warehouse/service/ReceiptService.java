package com.example.warehouse.service;

import com.example.warehouse.dto.ReceiptDTO;
import com.example.warehouse.model.Receipt;
import com.example.warehouse.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceiptService {
    @Autowired
    private ReceiptRepository receiptRepository;

    public List<ReceiptDTO> getAllReceipts() {
        return receiptRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private ReceiptDTO convertToDTO(Receipt receipt) {
        ReceiptDTO dto = new ReceiptDTO();
        dto.setMaPhieu(receipt.getMaPhieu());
        dto.setThoiGianTao(receipt.getThoiGianTao());
        dto.setNguoiTao(receipt.getNguoiTao());
        dto.setMaNhaCungCap(receipt.getMaNhaCungCap());
        dto.setTongTien(receipt.getTongTien());
        return dto;
    }
    public double getTotalImportValue() {
        return receiptRepository.findAll().stream()
                .mapToDouble(Receipt::getTongTien)
                .sum();
    }
    public long getTotalReceipts() {
        return receiptRepository.count();
    }
}