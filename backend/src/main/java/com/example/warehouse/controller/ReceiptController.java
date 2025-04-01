package com.example.warehouse.controller;

import com.example.warehouse.dto.ReceiptDTO;
import com.example.warehouse.dto.ReceiptDetailDTO;
import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.model.Receipt;
import com.example.warehouse.model.ReceiptDetail;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ReceiptController {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptController.class);

    @Autowired
    private ReceiptService receiptService;

    // GET: Lấy danh sách phiếu nhập
    @GetMapping("/receipts")
    public ResponseEntity<List<ReceiptDTO>> getAllReceipts() {
        try {
            logger.info("Lấy danh sách phiếu nhập");
            List<Receipt> receipts = receiptService.findAll();
            if (receipts.isEmpty()) {
                logger.info("Không có phiếu nhập nào được tìm thấy");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            // Chuyển đổi từ Receipt sang ReceiptDTO
            List<ReceiptDTO> receiptDTOs = receipts.stream().map(receipt -> {
                ReceiptDTO dto = new ReceiptDTO();
                dto.setMaPhieu(String.valueOf(receipt.getMaPhieuNhap())); // Chuyển Long thành String
                dto.setThoiGianTao(receipt.getNgayNhap());
                dto.setTongTien(receipt.getTongTien());

                // Chuyển đổi nguoiTao
                if (receipt.getNguoiTao() != null) {
                    dto.setNguoiTao(receipt.getNguoiTao().getUserName());
                }

                // Chuyển đổi maNhaCungCap
                if (receipt.getNhaCungCap() != null) {
                    dto.setMaNhaCungCap(receipt.getNhaCungCap().getMaNhaCungCap());
                }

                // Chuyển đổi chiTietPhieuNhaps
                if (receipt.getChiTietPhieuNhaps() != null) {
                    List<ReceiptDetailDTO> detailDTOs = receipt.getChiTietPhieuNhaps().stream().map(detail -> {
                        ReceiptDetailDTO detailDTO = new ReceiptDetailDTO();
                        detailDTO.setMaSanPham(detail.getId().getMaSanPham());
                        detailDTO.setLoaiSanPham(detail.getLoaiSanPham());
                        detailDTO.setSoLuong(detail.getSoLuong());
                        detailDTO.setDonGia(detail.getDonGia());

                        // Chuyển đổi sanPham
                        if (detail.getSanPham() != null) {
                            ProductDTO productDTO = new ProductDTO();
                            productDTO.setMaSanPham(detail.getSanPham().getMaSanPham());
                            productDTO.setLoaiSanPham(detail.getSanPham().getLoaiSanPham());
                            productDTO.setTenSanPham(detail.getSanPham().getTenSanPham());
                            productDTO.setSoLuong(detail.getSanPham().getSoLuong());
                            productDTO.setGia(detail.getSanPham().getGia());
                            productDTO.setXuatXu(detail.getSanPham().getXuatXu());
                            // productDTO.setTrangThai(detail.getSanPham().getTrangThai());
                            detailDTO.setSanPham(productDTO);
                        }

                        return detailDTO;
                    }).collect(Collectors.toList());
                    dto.setDetails(detailDTOs);
                }

                return dto;
            }).collect(Collectors.toList());

            return new ResponseEntity<>(receiptDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách phiếu nhập: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Lấy phiếu nhập theo ID
    @GetMapping("/receipts/{id}")
    public ResponseEntity<ReceiptDTO> getReceiptById(@PathVariable Long id) {
        try {
            logger.info("Lấy phiếu nhập với ID: {}", id);
            Receipt receipt = receiptService.findById(id);
            if (receipt == null) {
                logger.warn("Không tìm thấy phiếu nhập với ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Chuyển đổi từ Receipt sang ReceiptDTO
            ReceiptDTO dto = new ReceiptDTO();
            dto.setMaPhieu(String.valueOf(receipt.getMaPhieuNhap()));
            dto.setThoiGianTao(receipt.getNgayNhap());
            dto.setTongTien(receipt.getTongTien());

            if (receipt.getNguoiTao() != null) {
                dto.setNguoiTao(receipt.getNguoiTao().getUserName());
            }

            if (receipt.getNhaCungCap() != null) {
                dto.setMaNhaCungCap(receipt.getNhaCungCap().getMaNhaCungCap());
            }

            if (receipt.getChiTietPhieuNhaps() != null) {
                List<ReceiptDetailDTO> detailDTOs = receipt.getChiTietPhieuNhaps().stream().map(detail -> {
                    ReceiptDetailDTO detailDTO = new ReceiptDetailDTO();
                    detailDTO.setMaSanPham(detail.getId().getMaSanPham());
                    detailDTO.setLoaiSanPham(detail.getLoaiSanPham());
                    detailDTO.setSoLuong(detail.getSoLuong());
                    detailDTO.setDonGia(detail.getDonGia());

                    if (detail.getSanPham() != null) {
                        ProductDTO productDTO = new ProductDTO();
                        productDTO.setMaSanPham(detail.getSanPham().getMaSanPham());
                        productDTO.setLoaiSanPham(detail.getSanPham().getLoaiSanPham());
                        productDTO.setTenSanPham(detail.getSanPham().getTenSanPham());
                        productDTO.setSoLuong(detail.getSanPham().getSoLuong());
                        productDTO.setGia(detail.getSanPham().getGia());
                        productDTO.setXuatXu(detail.getSanPham().getXuatXu());
                        // productDTO.setTrangThai(detail.getSanPham().getTrangThai());
                        detailDTO.setSanPham(productDTO);
                    }

                    return detailDTO;
                }).collect(Collectors.toList());
                dto.setDetails(detailDTOs);
            }

            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy phiếu nhập với ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        try {
            logger.info("Xóa phiếu nhập với ID: {}", id);
            receiptService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa phiếu nhập với ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}