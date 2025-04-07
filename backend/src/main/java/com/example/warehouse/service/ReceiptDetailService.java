package com.example.warehouse.service;

import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.model.ReceiptDetailId;
import com.example.warehouse.repository.ReceiptDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceiptDetailService {

    @Autowired
    private ReceiptDetailRepository receiptDetailRepository;

    public ReceiptDetail findById(ReceiptDetailId id) {
        return receiptDetailRepository.findById(id).orElse(null);
    }

    public List<ReceiptDetail> findAll() {
        return receiptDetailRepository.findAll();
    }

    public ReceiptDetail save(ReceiptDetail detail) {
        return receiptDetailRepository.save(detail);
    }

    public void deleteById(ReceiptDetailId id) {
        receiptDetailRepository.deleteById(id);
    }

    public boolean existsByIdMaPhieuNhapAndIdMaSanPham(int maPhieuNhap, String maSanPham) {
        return receiptDetailRepository.existsByIdMaPhieuNhapAndIdMaSanPham(maPhieuNhap, maSanPham);
    }

    public List<ReceiptDetail> findByIdMaPhieuNhap(int maPhieuNhap) {
        return receiptDetailRepository.findByIdMaPhieuNhap(maPhieuNhap);
    }

    public List<ReceiptDetail> findByIdMaSanPham(String maSanPham) {
        return receiptDetailRepository.findByIdMaSanPham(maSanPham);
    }
}