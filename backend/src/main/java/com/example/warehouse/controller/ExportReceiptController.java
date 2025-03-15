package com.example.warehouse.controller;

import com.example.warehouse.dto.ExportReceiptDTO;
import com.example.warehouse.service.ExportReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/export-receipts")
public class ExportReceiptController {
    @Autowired
    private ExportReceiptService exportReceiptService;

    @GetMapping
    public List<ExportReceiptDTO> getAllExportReceipts() {
        return exportReceiptService.getAllExportReceipts();
    }
}