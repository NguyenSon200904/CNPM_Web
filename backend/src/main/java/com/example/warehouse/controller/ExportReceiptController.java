package com.example.warehouse.controller;

import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.repository.ExportReceiptDetailRepository;
import com.example.warehouse.repository.ReceiptDetailRepository;
import com.example.warehouse.service.ExportReceiptService;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ExportReceiptController {

    private static final Logger logger = LoggerFactory.getLogger(ExportReceiptController.class);

    @Autowired
    private ExportReceiptService exportReceiptService;

    @Autowired
    private ReceiptDetailRepository receiptDetailRepository;

    @Autowired
    private ExportReceiptDetailRepository exportReceiptDetailRepository;

    // GET: Lấy danh sách phiếu xuất
    @GetMapping("/export-receipts")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<List<ExportReceipt>> getAllExportReceipts() {
        try {
            logger.info("Lấy danh sách phiếu xuất");
            List<ExportReceipt> exportReceipts = exportReceiptService.findAll();
            if (exportReceipts.isEmpty()) {
                logger.info("Không có phiếu xuất nào được tìm thấy");
                return new ResponseEntity<>(Collections.emptyList(), HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(exportReceipts, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách phiếu xuất: {}", e.getMessage(), e);
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Lấy phiếu xuất theo ID
    @GetMapping("export-receipts/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ExportReceipt> getExportReceiptById(@PathVariable Integer id) {
        try {
            logger.info("Lấy phiếu xuất với ID: {}", id);
            ExportReceipt exportReceipt = exportReceiptService.findById(id);
            if (exportReceipt == null) {
                logger.warn("Không tìm thấy phiếu xuất với ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(exportReceipt, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy phiếu xuất với ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST: Tạo phiếu xuất mới
    @PostMapping("/export-receipts")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @Transactional
    public ResponseEntity<?> createExportReceipt(@RequestBody ExportReceipt receipt) {
        logger.info("Nhận request tạo phiếu xuất: {}", receipt);
        try {
            // Lấy danh sách chi tiết phiếu xuất
            List<ExportReceiptDetail> details = receipt.getChiTietPhieuXuats();

            // Kiểm tra số lượng tồn kho
            for (ExportReceiptDetail detail : details) {
                String maSanPham = detail.getId().getMaSanPham();
                int soLuongXuat = detail.getSoLuong();

                // Tính số lượng tồn kho
                int totalImported = receiptDetailRepository.getTotalImportedQuantityByMaSanPham(maSanPham);
                int totalExported = exportReceiptDetailRepository.getTotalExportedQuantityByMaSanPham(maSanPham);
                int soLuongTonKho = totalImported - totalExported;

                if (soLuongXuat > soLuongTonKho) {
                    logger.error("Số lượng xuất vượt quá số lượng tồn kho cho sản phẩm: {}", maSanPham);
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Số lượng xuất (" + soLuongXuat + ") vượt quá số lượng tồn kho ("
                            + soLuongTonKho + ") cho sản phẩm " + maSanPham);
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }

            // Lưu phiếu xuất
            ExportReceipt savedReceipt = exportReceiptService.save(receipt);
            logger.info("Tạo phiếu xuất thành công: {}", savedReceipt);
            return new ResponseEntity<>(savedReceipt, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi tạo phiếu xuất: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Lỗi không xác định khi tạo phiếu xuất: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Có lỗi xảy ra khi tạo phiếu xuất: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT: Cập nhật phiếu xuất
    @PutMapping("/export-receipts/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @Transactional
    public ResponseEntity<?> updateExportReceipt(@PathVariable Integer id, @RequestBody ExportReceipt receipt) {
        logger.info("Nhận request cập nhật phiếu xuất với ID: {}", id);
        try {
            // Kiểm tra xem phiếu xuất có tồn tại không
            ExportReceipt existingReceipt = exportReceiptService.findById(id);
            if (existingReceipt == null) {
                logger.warn("Không tìm thấy phiếu xuất với ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Cập nhật thông tin phiếu xuất
            receipt.setMaPhieuXuat(id);
            ExportReceipt updatedReceipt = exportReceiptService.save(receipt);
            logger.info("Cập nhật phiếu xuất thành công: {}", updatedReceipt);
            return new ResponseEntity<>(updatedReceipt, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi cập nhật phiếu xuất: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Lỗi không xác định khi cập nhật phiếu xuất: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Có lỗi xảy ra khi cập nhật phiếu xuất: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE: Xóa phiếu xuất
    @DeleteMapping("/export-receipts/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteExportReceipt(@PathVariable Integer id) {
        try {
            logger.info("Xóa phiếu xuất với ID: {}", id);
            exportReceiptService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa phiếu xuất với ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST: Thêm chi tiết phiếu xuất
    @PostMapping("/export-receipts/{id}/details")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @Transactional
    public ResponseEntity<?> addExportReceiptDetail(
            @PathVariable Integer id,
            @RequestBody ExportReceiptDetail detail) {
        logger.info("Nhận request thêm chi tiết phiếu xuất cho phiếu xuất ID: {}", id);
        try {
            // Kiểm tra xem phiếu xuất có tồn tại không
            ExportReceipt existingReceipt = exportReceiptService.findById(id);
            if (existingReceipt == null) {
                logger.warn("Không tìm thấy phiếu xuất với ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Kiểm tra số lượng tồn kho
            String maSanPham = detail.getId().getMaSanPham();
            int soLuongXuat = detail.getSoLuong();

            int totalImported = receiptDetailRepository.getTotalImportedQuantityByMaSanPham(maSanPham);
            int totalExported = exportReceiptDetailRepository.getTotalExportedQuantityByMaSanPham(maSanPham);
            int soLuongTonKho = totalImported - totalExported;

            if (soLuongXuat > soLuongTonKho) {
                logger.error("Số lượng xuất vượt quá số lượng tồn kho cho sản phẩm: {}", maSanPham);
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Số lượng xuất (" + soLuongXuat + ") vượt quá số lượng tồn kho ("
                        + soLuongTonKho + ") cho sản phẩm " + maSanPham);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Thiết lập ID cho chi tiết phiếu xuất
            detail.getId().setMaPhieuXuat(id);
            ExportReceiptDetail savedDetail = exportReceiptDetailRepository.save(detail);
            logger.info("Thêm chi tiết phiếu xuất thành công: {}", savedDetail);

            // Cập nhật tổng tiền của phiếu xuất
            ExportReceipt updatedReceipt = exportReceiptService.findById(id);
            updatedReceipt.setTongTien(
                    updatedReceipt.getChiTietPhieuXuats().stream()
                            .mapToDouble(d -> d.getSoLuong() * d.getDonGia())
                            .sum());
            exportReceiptService.save(updatedReceipt);

            return new ResponseEntity<>(savedDetail, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Lỗi khi thêm chi tiết phiếu xuất: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Có lỗi xảy ra khi thêm chi tiết phiếu xuất: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE: Xóa chi tiết phiếu xuất
    @DeleteMapping("/export-receipts/{id}/details/{maSanPham}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @Transactional
    public ResponseEntity<Void> deleteExportReceiptDetail(
            @PathVariable Integer id,
            @PathVariable String maSanPham) {
        logger.info("Nhận request xóa chi tiết phiếu xuất với ID: {} và mã sản phẩm: {}", id, maSanPham);
        try {
            // Kiểm tra xem phiếu xuất có tồn tại không
            ExportReceipt existingReceipt = exportReceiptService.findById(id);
            if (existingReceipt == null) {
                logger.warn("Không tìm thấy phiếu xuất với ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Xóa chi tiết phiếu xuất
            exportReceiptDetailRepository.deleteByIdMaPhieuXuatAndIdMaSanPham(id, maSanPham);
            logger.info("Xóa chi tiết phiếu xuất thành công cho phiếu xuất ID: {} và mã sản phẩm: {}", id, maSanPham);

            // Cập nhật tổng tiền của phiếu xuất
            ExportReceipt updatedReceipt = exportReceiptService.findById(id);
            updatedReceipt.setTongTien(
                    updatedReceipt.getChiTietPhieuXuats().stream()
                            .mapToDouble(d -> d.getSoLuong() * d.getDonGia())
                            .sum());
            exportReceiptService.save(updatedReceipt);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa chi tiết phiếu xuất: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}