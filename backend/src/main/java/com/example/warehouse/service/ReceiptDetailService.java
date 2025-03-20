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

    // Lấy chi tiết phiếu nhập theo id (maPhieu và maSanPham)
    public ReceiptDetail findById(ReceiptDetailId id) {
        return receiptDetailRepository.findById(id).orElse(null);
    }

    // Lấy danh sách chi tiết phiếu nhập theo maPhieu
    public List<ReceiptDetail> findByMaPhieu(String maPhieu) {
        return receiptDetailRepository.findByIdMaPhieu(maPhieu);
    }

    // Lấy danh sách chi tiết phiếu nhập theo maSanPham
    public List<ReceiptDetail> findByMaSanPham(String maSanPham) {
        return receiptDetailRepository.findByIdMaSanPham(maSanPham);
    }

    // Lấy tất cả chi tiết phiếu nhập
    public List<ReceiptDetail> findAll() {
        return receiptDetailRepository.findAll();
    }

    // Lưu hoặc cập nhật chi tiết phiếu nhập
    public ReceiptDetail save(ReceiptDetail receiptDetail) {
        return receiptDetailRepository.save(receiptDetail);
    }

    // Xóa chi tiết phiếu nhập theo id
    public void deleteById(ReceiptDetailId id) {
        receiptDetailRepository.deleteById(id);
    }

    // Kiểm tra xem một sản phẩm đã tồn tại trong phiếu nhập hay chưa
    public boolean existsByMaPhieuAndMaSanPham(String maPhieu, String maSanPham) {
        return receiptDetailRepository.existsByIdMaPhieuAndIdMaSanPham(maPhieu, maSanPham);
    }
}