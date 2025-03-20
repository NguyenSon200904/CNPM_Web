package com.example.warehouse.service;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;
import com.example.warehouse.repository.ExportReceiptDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExportReceiptDetailService {

    @Autowired
    private ExportReceiptDetailRepository exportReceiptDetailRepository;

    // Lấy chi tiết phiếu xuất theo id (maPhieu và maSanPham)
    public ExportReceiptDetail findById(ExportReceiptDetailId id) {
        return exportReceiptDetailRepository.findById(id).orElse(null);
    }

    // Lấy danh sách chi tiết phiếu xuất theo maPhieu
    public List<ExportReceiptDetail> findByMaPhieu(String maPhieu) {
        return exportReceiptDetailRepository.findByIdMaPhieu(maPhieu);
    }

    // Lấy danh sách chi tiết phiếu xuất theo maSanPham
    public List<ExportReceiptDetail> findByMaSanPham(String maSanPham) {
        return exportReceiptDetailRepository.findByIdMaSanPham(maSanPham);
    }

    // Lấy tất cả chi tiết phiếu xuất
    public List<ExportReceiptDetail> findAll() {
        return exportReceiptDetailRepository.findAll();
    }

    // Lưu hoặc cập nhật chi tiết phiếu xuất
    public ExportReceiptDetail save(ExportReceiptDetail exportReceiptDetail) {
        return exportReceiptDetailRepository.save(exportReceiptDetail);
    }

    // Xóa chi tiết phiếu xuất theo id
    public void deleteById(ExportReceiptDetailId id) {
        exportReceiptDetailRepository.deleteById(id);
    }

    // Kiểm tra xem một sản phẩm đã tồn tại trong phiếu xuất hay chưa
    public boolean existsByMaPhieuAndMaSanPham(Long maPhieu, String maSanPham) {
        return exportReceiptDetailRepository.existsByIdMaPhieuAndIdMaSanPham(maPhieu, maSanPham);
    }
}