package com.example.warehouse.service;

import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.repository.ExportReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExportReceiptService {

    @Autowired
    private ExportReceiptRepository exportReceiptRepository;

    public ExportReceipt findById(Long id) {
        return exportReceiptRepository.findById(id).orElse(null);
    }

    public List<ExportReceipt> findAll() {
        return exportReceiptRepository.findAll();
    }

    public ExportReceipt save(ExportReceipt exportReceipt) {
        return exportReceiptRepository.save(exportReceipt);
    }

    public void deleteById(Long id) {
        exportReceiptRepository.deleteById(id);
    }

    public List<ExportReceipt> findByNgayXuatBetween(LocalDateTime start, LocalDateTime end) {
        return exportReceiptRepository.findByNgayXuatBetween(start, end);
    }

    public Double getTotalExportReceiptAmount() {
        Double total = exportReceiptRepository.getTotalExportReceiptAmount();
        return total != null ? total : 0.0;
    }

    public Double getTotalExportReceiptAmountByNgayXuatBetween(LocalDateTime start, LocalDateTime end) {
        Double total = exportReceiptRepository.getTotalExportReceiptAmountByNgayXuatBetween(start, end);
        return total != null ? total : 0.0;
    }
}