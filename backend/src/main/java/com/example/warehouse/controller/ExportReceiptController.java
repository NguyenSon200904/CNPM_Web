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

    // Lấy phiếu xuất theo maPhieu
    @GetMapping("/{maPhieu}")
    public ResponseEntity<ExportReceipt> getExportReceiptByMaPhieu(@PathVariable String maPhieu) {
        ExportReceipt exportReceipt = exportReceiptService.findByMaPhieu(maPhieu);
        if (exportReceipt == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exportReceipt);
    }

    // Lấy danh sách phiếu xuất theo nguoiTao
    @GetMapping("/nguoi-tao/{nguoiTao}")
    public ResponseEntity<List<ExportReceipt>> getExportReceiptsByNguoiTao(@PathVariable String nguoiTao) {
        List<ExportReceipt> exportReceipts = exportReceiptService.findByNguoiTao(nguoiTao);
        return ResponseEntity.ok(exportReceipts);
    }

    // Lấy danh sách phiếu xuất theo khoảng thời gian
    @GetMapping("/time-range")
    public ResponseEntity<List<ExportReceipt>> getExportReceiptsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<ExportReceipt> exportReceipts = exportReceiptService.findByThoiGianTaoBetween(start, end);
        return ResponseEntity.ok(exportReceipts);
    }

    // Tạo phiếu xuất mới
    @PostMapping
    public ResponseEntity<ExportReceipt> createExportReceipt(@RequestBody ExportReceipt exportReceipt) {
        if (exportReceiptService.existsByMaPhieu(exportReceipt.getMaPhieu())) {
            return ResponseEntity.badRequest().build();
        }
        ExportReceipt savedExportReceipt = exportReceiptService.save(exportReceipt);
        return ResponseEntity.status(201).body(savedExportReceipt);
    }

    // Cập nhật phiếu xuất
    @PutMapping("/{maPhieu}")
    public ResponseEntity<ExportReceipt> updateExportReceipt(@PathVariable String maPhieu, @RequestBody ExportReceipt exportReceipt) {
        if (!exportReceiptService.existsByMaPhieu(maPhieu)) {
            return ResponseEntity.notFound().build();
        }
        exportReceipt.setMaPhieu(maPhieu);
        ExportReceipt updatedExportReceipt = exportReceiptService.save(exportReceipt);
        return ResponseEntity.ok(updatedExportReceipt);
    }

    // Xóa phiếu xuất
    @DeleteMapping("/{maPhieu}")
    public ResponseEntity<Void> deleteExportReceipt(@PathVariable String maPhieu) {
        if (!exportReceiptService.existsByMaPhieu(maPhieu)) {
            return ResponseEntity.notFound().build();
        }
        exportReceiptService.deleteByMaPhieu(maPhieu);
        return ResponseEntity.noContent().build();
    }
}