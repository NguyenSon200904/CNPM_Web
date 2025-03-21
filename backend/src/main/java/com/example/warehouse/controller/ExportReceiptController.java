package com.example.warehouse.controller;

import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.service.ExportReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/export-receipts")
public class ExportReceiptController {

    @Autowired
    private ExportReceiptService exportReceiptService;

    @GetMapping
    public ResponseEntity<List<ExportReceipt>> getAllExportReceipts() {
        List<ExportReceipt> exportReceipts = exportReceiptService.findAll();
        return ResponseEntity.ok(exportReceipts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExportReceipt> getExportReceiptById(@PathVariable Long id) {
        ExportReceipt exportReceipt = exportReceiptService.findById(id);
        if (exportReceipt == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exportReceipt);
    }

    @PostMapping
    public ResponseEntity<ExportReceipt> createExportReceipt(@RequestBody ExportReceipt exportReceipt) {
        ExportReceipt savedExportReceipt = exportReceiptService.save(exportReceipt);
        return ResponseEntity.status(201).body(savedExportReceipt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExportReceipt> updateExportReceipt(@PathVariable Long id,
            @RequestBody ExportReceipt exportReceipt) {
        ExportReceipt existingExportReceipt = exportReceiptService.findById(id);
        if (existingExportReceipt == null) {
            return ResponseEntity.notFound().build();
        }
        exportReceipt.setMaPhieuXuat(id);
        ExportReceipt updatedExportReceipt = exportReceiptService.save(exportReceipt);
        return ResponseEntity.ok(updatedExportReceipt);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExportReceipt(@PathVariable Long id) {
        ExportReceipt exportReceipt = exportReceiptService.findById(id);
        if (exportReceipt == null) {
            return ResponseEntity.notFound().build();
        }
        exportReceiptService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}