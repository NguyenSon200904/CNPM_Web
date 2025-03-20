package com.example.warehouse.controller;

import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.model.ReceiptDetailId;
import com.example.warehouse.service.ReceiptDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipt-details")
public class ReceiptDetailController {

    @Autowired
    private ReceiptDetailService receiptDetailService;

    // Lấy tất cả chi tiết phiếu nhập
    @GetMapping
    public ResponseEntity<List<ReceiptDetail>> getAllReceiptDetails() {
        List<ReceiptDetail> receiptDetails = receiptDetailService.findAll();
        return ResponseEntity.ok(receiptDetails);
    }

    // Lấy chi tiết phiếu nhập theo maPhieu và maSanPham
    @GetMapping("/{maPhieu}/{maSanPham}")
    public ResponseEntity<ReceiptDetail> getReceiptDetailById(@PathVariable String maPhieu, @PathVariable String maSanPham) {
        ReceiptDetailId id = new ReceiptDetailId();
        id.setMaPhieu(maPhieu);
        id.setMaSanPham(maSanPham);
        ReceiptDetail receiptDetail = receiptDetailService.findById(id);
        if (receiptDetail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receiptDetail);
    }

    // Lấy danh sách chi tiết phiếu nhập theo maPhieu
    @GetMapping("/ma-phieu/{maPhieu}")
    public ResponseEntity<List<ReceiptDetail>> getReceiptDetailsByMaPhieu(@PathVariable String maPhieu) {
        List<ReceiptDetail> receiptDetails = receiptDetailService.findByMaPhieu(maPhieu);
        return ResponseEntity.ok(receiptDetails);
    }

    // Lấy danh sách chi tiết phiếu nhập theo maSanPham
    @GetMapping("/ma-san-pham/{maSanPham}")
    public ResponseEntity<List<ReceiptDetail>> getReceiptDetailsByMaSanPham(@PathVariable String maSanPham) {
        List<ReceiptDetail> receiptDetails = receiptDetailService.findByMaSanPham(maSanPham);
        return ResponseEntity.ok(receiptDetails);
    }

    // Tạo chi tiết phiếu nhập mới
    @PostMapping
    public ResponseEntity<ReceiptDetail> createReceiptDetail(@RequestBody ReceiptDetail receiptDetail) {
        ReceiptDetailId id = receiptDetail.getId();
        if (receiptDetailService.existsByMaPhieuAndMaSanPham(id.getMaPhieu(), id.getMaSanPham())) {
            return ResponseEntity.badRequest().build();
        }
        ReceiptDetail savedReceiptDetail = receiptDetailService.save(receiptDetail);
        return ResponseEntity.status(201).body(savedReceiptDetail);
    }

    // Cập nhật chi tiết phiếu nhập
    @PutMapping("/{maPhieu}/{maSanPham}")
    public ResponseEntity<ReceiptDetail> updateReceiptDetail(
            @PathVariable String maPhieu, @PathVariable String maSanPham, @RequestBody ReceiptDetail receiptDetail) {
        ReceiptDetailId id = new ReceiptDetailId();
        id.setMaPhieu(maPhieu);
        id.setMaSanPham(maSanPham);
        if (!receiptDetailService.existsByMaPhieuAndMaSanPham(maPhieu, maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        receiptDetail.setId(id);
        ReceiptDetail updatedReceiptDetail = receiptDetailService.save(receiptDetail);
        return ResponseEntity.ok(updatedReceiptDetail);
    }

    // Xóa chi tiết phiếu nhập
    @DeleteMapping("/{maPhieu}/{maSanPham}")
    public ResponseEntity<Void> deleteReceiptDetail(@PathVariable String maPhieu, @PathVariable String maSanPham) {
        ReceiptDetailId id = new ReceiptDetailId();
        id.setMaPhieu(maPhieu);
        id.setMaSanPham(maSanPham);
        if (!receiptDetailService.existsByMaPhieuAndMaSanPham(maPhieu, maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        receiptDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}