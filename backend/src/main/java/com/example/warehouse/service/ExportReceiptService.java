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

    // Lấy phiếu xuất theo maPhieu
    public ExportReceipt findByMaPhieu(String maPhieu) {
        return exportReceiptRepository.findById(maPhieu).orElse(null);
    }

    // Lấy danh sách phiếu xuất theo nguoiTao
    public List<ExportReceipt> findByNguoiTao(String nguoiTao) {
        return exportReceiptRepository.findByNguoiTaoUserName(nguoiTao);
    }

    // Lấy danh sách phiếu xuất theo khoảng thời gian
    public List<ExportReceipt> findByThoiGianTaoBetween(LocalDateTime start, LocalDateTime end) {
        return exportReceiptRepository.findByThoiGianTaoBetween(start, end);
    }

    // Lấy tất cả phiếu xuất
    public List<ExportReceipt> findAll() {
        return exportReceiptRepository.findAll();
    }

    // Lưu hoặc cập nhật phiếu xuất
    public ExportReceipt save(ExportReceipt exportReceipt) {
        return exportReceiptRepository.save(exportReceipt);
    }

    // Xóa phiếu xuất theo maPhieu
    public void deleteByMaPhieu(String maPhieu) {
        exportReceiptRepository.deleteById(maPhieu);
    }

    // Kiểm tra xem phiếu xuất có tồn tại hay không
    public boolean existsByMaPhieu(String maPhieu) {
        return exportReceiptRepository.existsByMaPhieu(maPhieu);
    }
}