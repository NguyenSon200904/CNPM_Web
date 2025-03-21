package com.example.warehouse.controller;

import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.model.Product;
import com.example.warehouse.model.Receipt;
import com.example.warehouse.service.ExportReceiptService;
import com.example.warehouse.service.ProductService;
import com.example.warehouse.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatisticsController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private ExportReceiptService exportReceiptService;

    // Thống kê tổng quan
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverviewStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productService.countAll());
        stats.put("totalReceipts", receiptService.findAll().size());
        stats.put("totalExportReceipts", exportReceiptService.findAll().size());
        stats.put("totalReceiptAmount", receiptService.getTotalReceiptAmount());
        stats.put("totalExportReceiptAmount", exportReceiptService.getTotalExportReceiptAmount());

        return ResponseEntity.ok(stats);
    }

    // Thống kê phiếu nhập theo khoảng thời gian
    @GetMapping("/receipts/time-range")
    public ResponseEntity<Map<String, Object>> getReceiptStatsByNgayNhapBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Receipt> receipts = receiptService.findByNgayNhapBetween(start, end);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReceipts", receipts.size());
        stats.put("totalAmount", receiptService.getTotalReceiptAmountByNgayNhapBetween(start, end));

        return ResponseEntity.ok(stats);
    }

    // Thống kê phiếu xuất theo khoảng thời gian
    @GetMapping("/export-receipts/time-range")
    public ResponseEntity<Map<String, Object>> getExportReceiptStatsByNgayXuatBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<ExportReceipt> exportReceipts = exportReceiptService.findByNgayXuatBetween(start, end);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalExportReceipts", exportReceipts.size());
        stats.put("totalAmount", exportReceiptService.getTotalExportReceiptAmountByNgayXuatBetween(start, end));

        return ResponseEntity.ok(stats);
    }
}