package com.example.warehouse.service;

import com.example.warehouse.dto.InventoryDTO;
import com.example.warehouse.model.Product;
import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.repository.ReceiptRepository;

import jakarta.transaction.Transactional;

import com.example.warehouse.repository.ExportReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InventoryService {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ReceiptRepository receiptRepository;

  @Autowired
  private ExportReceiptRepository exportReceiptRepository;

  @Transactional
  public List<InventoryDTO> getInventory() {
    // Lấy tất cả sản phẩm
    List<Product> products = productRepository.findAll();

    // Tạo map để lưu số lượng nhập và xuất của từng sản phẩm
    Map<String, Integer> importQuantities = new HashMap<>();
    Map<String, Integer> exportQuantities = new HashMap<>();

    // Tính tổng số lượng nhập từ các phiếu nhập
    receiptRepository.findAll().forEach(receipt -> {
      for (ReceiptDetail detail : receipt.getChiTietPhieuNhaps()) {
        String maSanPham = detail.getId().getMaSanPham();
        importQuantities.put(maSanPham, importQuantities.getOrDefault(maSanPham, 0) + detail.getSoLuong());
      }
    });

    // Tính tổng số lượng xuất từ các phiếu xuất
    exportReceiptRepository.findAll().forEach(exportReceipt -> {
      for (ExportReceiptDetail detail : exportReceipt.getChiTietPhieuXuats()) {
        String maSanPham = detail.getId().getMaSanPham();
        exportQuantities.put(maSanPham, exportQuantities.getOrDefault(maSanPham, 0) + detail.getSoLuong());
      }
    });

    // Tính tồn kho và tạo danh sách InventoryDTO
    List<InventoryDTO> inventory = new ArrayList<>();
    for (Product product : products) {
      String maSanPham = product.getMaSanPham();
      int imported = importQuantities.getOrDefault(maSanPham, 0);
      int exported = exportQuantities.getOrDefault(maSanPham, 0);
      int soLuongTonKho = imported - exported;

      // Chỉ thêm sản phẩm có số lượng tồn kho > 0
      if (soLuongTonKho > 0) {
        inventory.add(new InventoryDTO(
            product.getMaSanPham(),
            product.getTenSanPham(),
            product.getLoaiSanPham(),
            product.getGia(),
            soLuongTonKho));
      }
    }

    return inventory;
  }
}