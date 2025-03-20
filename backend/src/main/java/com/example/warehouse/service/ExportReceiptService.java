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

    // Lấy phiếu xuất theo maPhieuXuat
    public ExportReceipt findByMaPhieuXuat(Long maPhieuXuat) {
        return exportReceiptRepository.findById(maPhieuXuat).orElse(null);
    }

    // Lấy danh sách phiếu xuất theo nguoiTao
    public List<ExportReceipt> findByAccountUserName(String userName) {
        return exportReceiptRepository.findByAccountUserName(userName);
    }

    // Lấy danh sách phiếu xuất theo khoảng thời gian
    public List<ExportReceipt> findByNgayXuatBetween(LocalDateTime start, LocalDateTime end) {
        return exportReceiptRepository.findByNgayXuatBetween(start, end);
    }

    // Lấy tất cả phiếu xuất
    public List<ExportReceipt> findAll() {
        return exportReceiptRepository.findAll();
    }

    // Lưu hoặc cập nhật phiếu xuất
    public ExportReceipt save(ExportReceipt exportReceipt) {
        return exportReceiptRepository.save(exportReceipt);
    }

    // Xóa phiếu xuất theo maPhieuXuat
    public void deleteByMaPhieuXuat(Long maPhieuXuat) {
        exportReceiptRepository.deleteById(maPhieuXuat);
    }

    // Kiểm tra xem phiếu xuất có tồn tại hay không
    public boolean existsByMaPhieuXuat(Long maPhieuXuat) {
        return exportReceiptRepository.existsByMaPhieuXuat(maPhieuXuat);
    }
}