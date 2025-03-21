package com.example.warehouse.controller;

import com.example.warehouse.model.Receipt;
import com.example.warehouse.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping
    public ResponseEntity<List<Receipt>> getAllReceipts() {
        List<Receipt> receipts = receiptService.findAll();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(@PathVariable Long id) {
        Receipt receipt = receiptService.findById(id);
        if (receipt == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receipt);
    }

    @PostMapping
    public ResponseEntity<Receipt> createReceipt(@RequestBody Receipt receipt) {
        Receipt savedReceipt = receiptService.save(receipt);
        return ResponseEntity.status(201).body(savedReceipt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receipt> updateReceipt(@PathVariable Long id, @RequestBody Receipt receipt) {
        Receipt existingReceipt = receiptService.findById(id);
        if (existingReceipt == null) {
            return ResponseEntity.notFound().build();
        }
        receipt.setMaPhieuNhap(id);
        Receipt updatedReceipt = receiptService.save(receipt);
        return ResponseEntity.ok(updatedReceipt);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        Receipt receipt = receiptService.findById(id);
        if (receipt == null) {
            return ResponseEntity.notFound().build();
        }
        receiptService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-user/{userName}")
    public ResponseEntity<List<Receipt>> getReceiptsByUserName(@PathVariable String userName) {
        List<Receipt> receipts = receiptService.findByNguoiTaoUserName(userName);
        return ResponseEntity.ok(receipts);
    }
}