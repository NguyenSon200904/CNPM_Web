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

    // Lấy phiếu nhập theo maPhieu
    public Receipt findByMaPhieu(String maPhieu) {
        return receiptRepository.findById(maPhieu).orElse(null);
    }

    // Lấy danh sách phiếu nhập theo nguoiTao
    public List<Receipt> findByNguoiTao(String nguoiTao) {
        return receiptRepository.findByNguoiTaoUserName(nguoiTao);
    }

    // Lấy danh sách phiếu nhập theo maNhaCungCap
    public List<Receipt> findByMaNhaCungCap(String maNhaCungCap) {
        return receiptRepository.findByNhaCungCapMaNhaCungCap(maNhaCungCap);
    }

    // Lấy danh sách phiếu nhập theo khoảng thời gian
    public List<Receipt> findByThoiGianTaoBetween(LocalDateTime start, LocalDateTime end) {
        return receiptRepository.findByThoiGianTaoBetween(start, end);
    }

    // Thêm phương thức findByNgayNhapBetween
    public List<Receipt> findByNgayNhapBetween(LocalDateTime start, LocalDateTime end) {
        return receiptRepository.findByThoiGianTaoBetween(start, end);
    }

    // Lấy tất cả phiếu nhập
    public List<Receipt> findAll() {
        return receiptRepository.findAll();
    }

    // Lưu hoặc cập nhật phiếu nhập
    public Receipt save(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    // Xóa phiếu nhập theo maPhieu
    public void deleteByMaPhieu(String maPhieu) {
        receiptRepository.deleteById(maPhieu);
    }

    // Kiểm tra xem phiếu nhập có tồn tại hay không
    public boolean existsByMaPhieu(String maPhieu) {
        return receiptRepository.existsByMaPhieu(maPhieu);
    }
}