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

    @GetMapping
    public ResponseEntity<List<ReceiptDetail>> getAllReceiptDetails() {
        List<ReceiptDetail> receiptDetails = receiptDetailService.findAll();
        return ResponseEntity.ok(receiptDetails);
    }

    @GetMapping("/{maPhieuNhap}/{maSanPham}")
    public ResponseEntity<ReceiptDetail> getReceiptDetailById(@PathVariable Long maPhieuNhap,
            @PathVariable String maSanPham) {
        ReceiptDetailId id = new ReceiptDetailId();
        id.setMaPhieuNhap(maPhieuNhap);
        id.setMaSanPham(maSanPham);
        ReceiptDetail receiptDetail = receiptDetailService.findById(id);
        if (receiptDetail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receiptDetail);
    }

    @GetMapping("/ma-phieu/{maPhieuNhap}")
    public ResponseEntity<List<ReceiptDetail>> getReceiptDetailsByMaPhieuNhap(@PathVariable Long maPhieuNhap) {
        List<ReceiptDetail> receiptDetails = receiptDetailService.findByIdMaPhieuNhap(maPhieuNhap);
        return ResponseEntity.ok(receiptDetails);
    }

    @GetMapping("/ma-san-pham/{maSanPham}")
    public ResponseEntity<List<ReceiptDetail>> getReceiptDetailsByMaSanPham(@PathVariable String maSanPham) {
        List<ReceiptDetail> receiptDetails = receiptDetailService.findByIdMaSanPham(maSanPham);
        return ResponseEntity.ok(receiptDetails);
    }

    @PostMapping
    public ResponseEntity<ReceiptDetail> createReceiptDetail(@RequestBody ReceiptDetail receiptDetail) {
        ReceiptDetailId id = receiptDetail.getId();
        if (id == null
                || receiptDetailService.existsByIdMaPhieuNhapAndIdMaSanPham(id.getMaPhieuNhap(), id.getMaSanPham())) {
            return ResponseEntity.badRequest().build();
        }
        ReceiptDetail savedReceiptDetail = receiptDetailService.save(receiptDetail);
        return ResponseEntity.status(201).body(savedReceiptDetail);
    }

    @PutMapping("/{maPhieuNhap}/{maSanPham}")
    public ResponseEntity<ReceiptDetail> updateReceiptDetail(
            @PathVariable Long maPhieuNhap, @PathVariable String maSanPham, @RequestBody ReceiptDetail receiptDetail) {
        ReceiptDetailId id = new ReceiptDetailId();
        id.setMaPhieuNhap(maPhieuNhap);
        id.setMaSanPham(maSanPham);
        if (!receiptDetailService.existsByIdMaPhieuNhapAndIdMaSanPham(maPhieuNhap, maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        receiptDetail.setId(id);
        ReceiptDetail updatedReceiptDetail = receiptDetailService.save(receiptDetail);
        return ResponseEntity.ok(updatedReceiptDetail);
    }

    @DeleteMapping("/{maPhieuNhap}/{maSanPham}")
    public ResponseEntity<Void> deleteReceiptDetail(@PathVariable Long maPhieuNhap, @PathVariable String maSanPham) {
        ReceiptDetailId id = new ReceiptDetailId();
        id.setMaPhieuNhap(maPhieuNhap);
        id.setMaSanPham(maSanPham);
        if (!receiptDetailService.existsByIdMaPhieuNhapAndIdMaSanPham(maPhieuNhap, maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        receiptDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}