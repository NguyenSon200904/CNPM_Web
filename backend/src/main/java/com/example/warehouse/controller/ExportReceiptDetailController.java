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

    @GetMapping
    public ResponseEntity<List<ExportReceiptDetail>> getAllDetails() {
        List<ExportReceiptDetail> details = exportReceiptDetailService.findAll();
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{maPhieuXuat}/{maSanPham}")
    public ResponseEntity<ExportReceiptDetail> getDetailById(@PathVariable Integer maPhieuXuat,
            @PathVariable String maSanPham) {
        ExportReceiptDetailId id = new ExportReceiptDetailId();
        id.setMaPhieuXuat(maPhieuXuat);
        id.setMaSanPham(maSanPham);
        ExportReceiptDetail detail = exportReceiptDetailService.findById(id);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detail);
    }

    @PostMapping
    public ResponseEntity<ExportReceiptDetail> createDetail(@RequestBody ExportReceiptDetail detail) {
        if (exportReceiptDetailService.existsByIdMaPhieuXuatAndIdMaSanPham(
                detail.getId().getMaPhieuXuat(),
                detail.getId().getMaSanPham())) {
            return ResponseEntity.badRequest().build();
        }
        ExportReceiptDetail savedDetail = exportReceiptDetailService.save(detail);
        return ResponseEntity.status(201).body(savedDetail);
    }

    @PutMapping("/{maPhieuXuat}/{maSanPham}")
    public ResponseEntity<ExportReceiptDetail> updateDetail(@PathVariable Integer maPhieuXuat,
            @PathVariable String maSanPham,
            @RequestBody ExportReceiptDetail detail) {
        ExportReceiptDetailId id = new ExportReceiptDetailId();
        id.setMaPhieuXuat(maPhieuXuat);
        id.setMaSanPham(maSanPham);
        if (!exportReceiptDetailService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        detail.setId(id);
        ExportReceiptDetail updatedDetail = exportReceiptDetailService.save(detail);
        return ResponseEntity.ok(updatedDetail);
    }

    @DeleteMapping("/{maPhieuXuat}/{maSanPham}")
    public ResponseEntity<Void> deleteDetail(@PathVariable Integer maPhieuXuat,
            @PathVariable String maSanPham) {
        ExportReceiptDetailId id = new ExportReceiptDetailId();
        id.setMaPhieuXuat(maPhieuXuat);
        id.setMaSanPham(maSanPham);
        if (!exportReceiptDetailService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        exportReceiptDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-ma-phieu-xuat/{maPhieuXuat}")
    public ResponseEntity<List<ExportReceiptDetail>> getDetailsByMaPhieuXuat(@PathVariable Long maPhieuXuat) {
        List<ExportReceiptDetail> details = exportReceiptDetailService.findByIdMaPhieuXuat(maPhieuXuat);
        return ResponseEntity.ok(details);
    }
}