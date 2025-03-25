package com.example.warehouse.controller;

import com.example.warehouse.model.Receipt;
import com.example.warehouse.service.ReceiptService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ReceiptController {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptController.class);

    @Autowired
    private ReceiptService receiptService;

    // GET: Lấy danh sách phiếu nhập
    @GetMapping("/receipts")
    public List<Receipt> getAllReceipts() {
        logger.info("Lấy danh sách phiếu nhập");
        return receiptService.findAll();
    }

    // GET: Lấy phiếu nhập theo ID
    @GetMapping("/receipts/{id}")
    public Receipt getReceiptById(@PathVariable Long id) {
        logger.info("Lấy phiếu nhập với ID: {}", id);
        return receiptService.findById(id);
    }

    // POST: Tạo phiếu nhập mới
    @PostMapping("/receipts")
    public ResponseEntity<?> createReceipt(@RequestBody Receipt receipt) {
        logger.info("Nhận request tạo phiếu nhập: {}", receipt);
        try {
            Receipt savedReceipt = receiptService.save(receipt);
            logger.info("Tạo phiếu nhập thành công: {}", savedReceipt);
            return new ResponseEntity<>(savedReceipt, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi tạo phiếu nhập: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Lỗi không xác định khi tạo phiếu nhập: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Có lỗi xảy ra khi tạo phiếu nhập: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE: Xóa phiếu nhập
    @DeleteMapping("/receipts/{id}")
    public void deleteReceipt(@PathVariable Long id) {
        logger.info("Xóa phiếu nhập với ID: {}", id);
        receiptService.deleteById(id);
    }
}