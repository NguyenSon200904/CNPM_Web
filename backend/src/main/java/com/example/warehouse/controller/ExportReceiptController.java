package com.example.warehouse.controller;

import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.service.ExportReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/export-receipts")
public class ExportReceiptController {

    @Autowired
    private ExportReceiptService exportReceiptService;

    // Lấy tất cả phiếu xuất
    @GetMapping
    public ResponseEntity<List<ExportReceipt>> getAllExportReceipts() {
        List<ExportReceipt> exportReceipts = exportReceiptService.findAll();
        return ResponseEntity.ok(exportReceipts);
    }

    // Lấy phiếu xuất theo maPhieuXuat
    @GetMapping("/{maPhieuXuat}")
    public ResponseEntity<ExportReceipt> getExportReceiptByMaPhieuXuat(@PathVariable Long maPhieuXuat) {
        ExportReceipt exportReceipt = exportReceiptService.findByMaPhieuXuat(maPhieuXuat);
        if (exportReceipt == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exportReceipt);
    }

    // Lấy danh sách phiếu xuất theo userName
    @GetMapping("/nguoi-tao/{userName}")
    public ResponseEntity<List<ExportReceipt>> getExportReceiptsByAccountUserName(@PathVariable String userName) {
        List<ExportReceipt> exportReceipts = exportReceiptService.findByAccountUserName(userName);
        return ResponseEntity.ok(exportReceipts);
    }

    // Lấy danh sách phiếu xuất theo khoảng thời gian
    @GetMapping("/time-range")
    public ResponseEntity<List<ExportReceipt>> getExportReceiptsByNgayXuatBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<ExportReceipt> exportReceipts = exportReceiptService.findByNgayXuatBetween(start, end);
        return ResponseEntity.ok(exportReceipts);
    }

    // Tạo phiếu xuất mới
    @PostMapping
    public ResponseEntity<ExportReceipt> createExportReceipt(@RequestBody ExportReceipt exportReceipt) {
        if (exportReceiptService.existsByMaPhieuXuat(exportReceipt.getMaPhieuXuat())) {
            return ResponseEntity.badRequest().build();
        }
        ExportReceipt savedExportReceipt = exportReceiptService.save(exportReceipt);
        return ResponseEntity.status(201).body(savedExportReceipt);
    }

    // Cập nhật phiếu xuất
    @PutMapping("/{maPhieuXuat}")
    public ResponseEntity<ExportReceipt> updateExportReceipt(@PathVariable Long maPhieuXuat,
            @RequestBody ExportReceipt exportReceipt) {
        if (!exportReceiptService.existsByMaPhieuXuat(maPhieuXuat)) {
            return ResponseEntity.notFound().build();
        }
        exportReceipt.setMaPhieuXuat(maPhieuXuat);
        ExportReceipt updatedExportReceipt = exportReceiptService.save(exportReceipt);
        return ResponseEntity.ok(updatedExportReceipt);
    }

    // Xóa phiếu xuất
    @DeleteMapping("/{maPhieuXuat}")
    public ResponseEntity<Void> deleteExportReceipt(@PathVariable Long maPhieuXuat) {
        if (!exportReceiptService.existsByMaPhieuXuat(maPhieuXuat)) {
            return ResponseEntity.notFound().build();
        }
        exportReceiptService.deleteByMaPhieuXuat(maPhieuXuat);
        return ResponseEntity.noContent().build();
    }
}