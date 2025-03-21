package com.example.warehouse.service;

import com.example.warehouse.model.Receipt;
import com.example.warehouse.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    public Receipt findById(Long id) {
        return receiptRepository.findById(id).orElse(null);
    }

    public List<Receipt> findAll() {
        return receiptRepository.findAll();
    }

    public Receipt save(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    public void deleteById(Long id) {
        receiptRepository.deleteById(id);
    }

    public List<Receipt> findByNguoiTaoUserName(String userName) {
        return receiptRepository.findByNguoiTaoUserName(userName);
    }

    public List<Receipt> findByNgayNhapBetween(LocalDateTime start, LocalDateTime end) {
        return receiptRepository.findByNgayNhapBetween(start, end);
    }

    public Double getTotalReceiptAmount() {
        Double total = receiptRepository.getTotalReceiptAmount();
        return total != null ? total : 0.0;
    }

    public Double getTotalReceiptAmountByNgayNhapBetween(LocalDateTime start, LocalDateTime end) {
        Double total = receiptRepository.getTotalReceiptAmountByNgayNhapBetween(start, end);
        return total != null ? total : 0.0;
    }
}