package com.example.warehouse.controller;

import com.example.warehouse.service.ProductService;
import com.example.warehouse.service.ReceiptService;
import com.example.warehouse.service.ExportReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {
    @Autowired
    private ProductService productService;
    @Autowired
    private ReceiptService receiptService;
    @Autowired
    private ExportReceiptService exportReceiptService;

    @GetMapping("/total-products")
    public long getTotalProducts() {
        return productService.getTotalProducts();
    }

    @GetMapping("/total-import-receipts")
    public long getTotalImportReceipts() {
        return receiptService.getTotalReceipts();
    }

    @GetMapping("/total-export-receipts")
    public long getTotalExportReceipts() {
        return exportReceiptService.getTotalExportReceipts();
    }

    @GetMapping("/total-import")
    public double getTotalImportValue() {
        return receiptService.getTotalImportValue();
    }

    @GetMapping("/total-export")
    public double getTotalExportValue() {
        return exportReceiptService.getTotalExportValue();
    }
}