package com.example.warehouse.controller;

import com.example.warehouse.dto.ReceiptDTO;
import com.example.warehouse.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {
    @Autowired
    private ReceiptService receiptService;

    @GetMapping
    public List<ReceiptDTO> getAllReceipts() {
        return receiptService.getAllReceipts();
    }
}