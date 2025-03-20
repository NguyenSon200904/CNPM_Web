package com.example.warehouse.controller;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;
import com.example.warehouse.service.ExportReceiptDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/export-receipt-details")
public class ExportReceiptDetailController {

    @Autowired
    private ExportReceiptDetailService exportReceiptDetailService;

    // Lấy tất cả chi tiết phiếu xuất
    @GetMapping
    public ResponseEntity<List<ExportReceiptDetail>> getAllExportReceiptDetails() {
        List<ExportReceiptDetail> exportReceiptDetails = exportReceiptDetailService.findAll();
        return ResponseEntity.ok(exportReceiptDetails);
    }

    // Lấy chi tiết phiếu xuất theo maPhieu và maSanPham
    @GetMapping("/{maPhieu}/{maSanPham}")
    public ResponseEntity<ExportReceiptDetail> getExportReceiptDetailById(@PathVariable String maPhieu, @PathVariable String maSanPham) {
        ExportReceiptDetailId id = new ExportReceiptDetailId();
        id.setMaPhieu(maPhieu);
        id.setMaSanPham(maSanPham);
        ExportReceiptDetail exportReceiptDetail = exportReceiptDetailService.findById(id);
        if (exportReceiptDetail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exportReceiptDetail);
    }

    // Lấy danh sách chi tiết phiếu xuất theo maPhieu
    @GetMapping("/ma-phieu/{maPhieu}")
    public ResponseEntity<List<ExportReceiptDetail>> getExportReceiptDetailsByMaPhieu(@PathVariable String maPhieu) {
        List<ExportReceiptDetail> exportReceiptDetails = exportReceiptDetailService.findByMaPhieu(maPhieu);
        return ResponseEntity.ok(exportReceiptDetails);
    }

    // Lấy danh sách chi tiết phiếu xuất theo maSanPham
    @GetMapping("/ma-san-pham/{maSanPham}")
    public ResponseEntity<List<ExportReceiptDetail>> getExportReceiptDetailsByMaSanPham(@PathVariable String maSanPham) {
        List<ExportReceiptDetail> exportReceiptDetails = exportReceiptDetailService.findByMaSanPham(maSanPham);
        return ResponseEntity.ok(exportReceiptDetails);
    }

    // Tạo chi tiết phiếu xuất mới
    @PostMapping
    public ResponseEntity<ExportReceiptDetail> createExportReceiptDetail(@RequestBody ExportReceiptDetail exportReceiptDetail) {
        ExportReceiptDetailId id = exportReceiptDetail.getId();
        if (exportReceiptDetailService.existsByMaPhieuAndMaSanPham(id.getMaPhieu(), id.getMaSanPham())) {
            return ResponseEntity.badRequest().build();
        }
        ExportReceiptDetail savedExportReceiptDetail = exportReceiptDetailService.save(exportReceiptDetail);
        return ResponseEntity.status(201).body(savedExportReceiptDetail);
    }

    // Cập nhật chi tiết phiếu xuất
    @PutMapping("/{maPhieu}/{maSanPham}")
    public ResponseEntity<ExportReceiptDetail> updateExportReceiptDetail(
            @PathVariable String maPhieu, @PathVariable String maSanPham, @RequestBody ExportReceiptDetail exportReceiptDetail) {
        ExportReceiptDetailId id = new ExportReceiptDetailId();
        id.setMaPhieu(maPhieu);
        id.setMaSanPham(maSanPham);
        if (!exportReceiptDetailService.existsByMaPhieuAndMaSanPham(maPhieu, maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        exportReceiptDetail.setId(id);
        ExportReceiptDetail updatedExportReceiptDetail = exportReceiptDetailService.save(exportReceiptDetail);
        return ResponseEntity.ok(updatedExportReceiptDetail);
    }

    // Xóa chi tiết phiếu xuất
    @DeleteMapping("/{maPhieu}/{maSanPham}")
    public ResponseEntity<Void> deleteExportReceiptDetail(@PathVariable String maPhieu, @PathVariable String maSanPham) {
        ExportReceiptDetailId id = new ExportReceiptDetailId();
        id.setMaPhieu(maPhieu);
        id.setMaSanPham(maSanPham);
        if (!exportReceiptDetailService.existsByMaPhieuAndMaSanPham(maPhieu, maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        exportReceiptDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}