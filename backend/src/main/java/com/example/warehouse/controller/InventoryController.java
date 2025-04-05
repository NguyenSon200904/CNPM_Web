package com.example.warehouse.controller;

import com.example.warehouse.dto.InventoryDTO;
import com.example.warehouse.model.Product;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.repository.ReceiptDetailRepository;
import com.example.warehouse.repository.ExportReceiptDetailRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

  private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ReceiptDetailRepository receiptDetailRepository;

  @Autowired
  private ExportReceiptDetailRepository exportReceiptDetailRepository;

  @GetMapping("/inventory")
  public ResponseEntity<List<InventoryDTO>> getInventory() {
    try {
      logger.info("Lấy danh sách tồn kho");
      List<Product> products = productRepository.findAll();
      if (products.isEmpty()) {
        logger.info("Không có sản phẩm nào trong kho");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      List<InventoryDTO> inventoryDTOs = products.stream().map(product -> {
        InventoryDTO dto = new InventoryDTO();
        dto.setMaSanPham(product.getMaSanPham());
        dto.setTenSanPham(product.getTenSanPham());
        dto.setLoaiSanPham(product.getLoaiSanPham());
        dto.setGia(product.getGia());

        // Tính số lượng tồn kho
        int totalImported = receiptDetailRepository.getTotalImportedQuantityByMaSanPham(product.getMaSanPham());
        int totalExported = exportReceiptDetailRepository.getTotalExportedQuantityByMaSanPham(product.getMaSanPham());
        int soLuongTonKho = totalImported - totalExported;
        dto.setSoLuongTonKho(soLuongTonKho);

        return dto;
      }).filter(dto -> dto.getSoLuongTonKho() > 0) // Chỉ hiển thị sản phẩm có tồn kho > 0
          .collect(Collectors.toList());

      if (inventoryDTOs.isEmpty()) {
        logger.info("Không có sản phẩm nào có tồn kho");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(inventoryDTOs, HttpStatus.OK);
    } catch (Exception e) {
      logger.error("Lỗi khi lấy danh sách tồn kho: {}", e.getMessage(), e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}