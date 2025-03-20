package com.example.warehouse.controller;

import com.example.warehouse.model.Receipt;
import com.example.warehouse.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    // Lấy tất cả phiếu nhập
    @GetMapping
    public ResponseEntity<List<Receipt>> getAllReceipts() {
        List<Receipt> receipts = receiptService.findAll();
        return ResponseEntity.ok(receipts);
    }

    // Lấy phiếu nhập theo maPhieu
    @GetMapping("/{maPhieu}")
    public ResponseEntity<Receipt> getReceiptByMaPhieu(@PathVariable String maPhieu) {
        Receipt receipt = receiptService.findByMaPhieu(maPhieu);
        if (receipt == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receipt);
    }

    // Lấy danh sách phiếu nhập theo nguoiTao
    @GetMapping("/nguoi-tao/{nguoiTao}")
    public ResponseEntity<List<Receipt>> getReceiptsByNguoiTao(@PathVariable String nguoiTao) {
        List<Receipt> receipts = receiptService.findByNguoiTao(nguoiTao);
        return ResponseEntity.ok(receipts);
    }

    // Lấy danh sách phiếu nhập theo maNhaCungCap
    @GetMapping("/nha-cung-cap/{maNhaCungCap}")
    public ResponseEntity<List<Receipt>> getReceiptsByMaNhaCungCap(@PathVariable String maNhaCungCap) {
        List<Receipt> receipts = receiptService.findByMaNhaCungCap(maNhaCungCap);
        return ResponseEntity.ok(receipts);
    }

    // Lấy danh sách phiếu nhập theo khoảng thời gian
    @GetMapping("/time-range")
    public ResponseEntity<List<Receipt>> getReceiptsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Receipt> receipts = receiptService.findByThoiGianTaoBetween(start, end);
        return ResponseEntity.ok(receipts);
    }

    // Tạo phiếu nhập mới
    @PostMapping
    public ResponseEntity<Receipt> createReceipt(@RequestBody Receipt receipt) {
        if (receiptService.existsByMaPhieu(receipt.getMaPhieu())) {
            return ResponseEntity.badRequest().build();
        }
        Receipt savedReceipt = receiptService.save(receipt);
        return ResponseEntity.status(201).body(savedReceipt);
    }

    // Cập nhật phiếu nhập
    @PutMapping("/{maPhieu}")
    public ResponseEntity<Receipt> updateReceipt(@PathVariable String maPhieu, @RequestBody Receipt receipt) {
        if (!receiptService.existsByMaPhieu(maPhieu)) {
            return ResponseEntity.notFound().build();
        }
        receipt.setMaPhieu(maPhieu);
        Receipt updatedReceipt = receiptService.save(receipt);
        return ResponseEntity.ok(updatedReceipt);
    }

    // Xóa phiếu nhập
    @DeleteMapping("/{maPhieu}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable String maPhieu) {
        if (!receiptService.existsByMaPhieu(maPhieu)) {
            return ResponseEntity.notFound().build();
        }
        receiptService.deleteByMaPhieu(maPhieu);
        return ResponseEntity.noContent().build();
    }
}