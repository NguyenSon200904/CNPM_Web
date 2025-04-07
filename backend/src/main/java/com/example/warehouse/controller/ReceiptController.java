package com.example.warehouse.controller;

import com.example.warehouse.dto.ReceiptDTO;
import com.example.warehouse.dto.ReceiptDetailDTO;
import com.example.warehouse.entity.NhaCungCap;
import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.model.Product;
import com.example.warehouse.model.Receipt;
import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.repository.ExportReceiptDetailRepository;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.repository.ReceiptDetailRepository;
import com.example.warehouse.repository.ReceiptRepository;
import com.example.warehouse.repository.SupplierRepository;
import com.example.warehouse.service.ProductService;
import com.example.warehouse.service.ReceiptService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ReceiptController {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptController.class);

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private ReceiptDetailRepository receiptDetailRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ExportReceiptDetailRepository exportReceiptDetailRepository;

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
                            productDTO.setSoLuongCoTheNhap(detail.getSanPham().getSoLuongCoTheNhap());
                            productDTO.setGia(detail.getSanPham().getGia());
                            productDTO.setXuatXu(detail.getSanPham().getXuatXu());
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
    public ResponseEntity<ReceiptDTO> getReceiptById(@PathVariable int id) {
        try {
            logger.info("Lấy phiếu nhập với ID: {}", id);
            Receipt receipt = receiptService.findById(id);
            if (receipt == null) {
                logger.warn("Không tìm thấy phiếu nhập với ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

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
                        productDTO.setSoLuongCoTheNhap(detail.getSanPham().getSoLuongCoTheNhap());
                        productDTO.setGia(detail.getSanPham().getGia());
                        productDTO.setXuatXu(detail.getSanPham().getXuatXu());
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
            // Kiểm tra dữ liệu đầu vào
            if (receipt == null || receipt.getChiTietPhieuNhaps() == null || receipt.getChiTietPhieuNhaps().isEmpty()) {
                logger.error("Dữ liệu phiếu nhập không hợp lệ hoặc không có chi tiết phiếu nhập");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Dữ liệu phiếu nhập không hợp lệ hoặc không có chi tiết phiếu nhập");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Lấy danh sách chi tiết phiếu nhập
            List<ReceiptDetail> details = receipt.getChiTietPhieuNhaps();

            // Kiểm tra số lượng có thể nhập
            for (ReceiptDetail detail : details) {
                String maSanPham = detail.getId().getMaSanPham();
                int soLuongNhap = detail.getSoLuong();
                logger.info("Kiểm tra sản phẩm {}: Số lượng nhập = {}", maSanPham, soLuongNhap);

                Product product = productService.findByMaSanPham(maSanPham);
                if (product == null) {
                    logger.error("Sản phẩm không tồn tại: {}", maSanPham);
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Sản phẩm không tồn tại: " + maSanPham);
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }

                long soLuongCoTheNhap = product.getSoLuongCoTheNhap();
                if (soLuongNhap <= 0) {
                    logger.error("Số lượng nhập không hợp lệ cho sản phẩm: {}", maSanPham);
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Số lượng nhập phải lớn hơn 0 cho sản phẩm: " + maSanPham);
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }

                if (soLuongNhap > soLuongCoTheNhap) {
                    logger.error("Số lượng nhập vượt quá số lượng có thể nhập cho sản phẩm: {}", maSanPham);
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Số lượng nhập (" + soLuongNhap + ") vượt quá số lượng có thể nhập ("
                            + soLuongCoTheNhap + ") cho sản phẩm " + maSanPham);
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }

            // Cập nhật số lượng có thể nhập
            for (ReceiptDetail detail : details) {
                String maSanPham = detail.getId().getMaSanPham();
                int soLuongNhap = detail.getSoLuong();
                logger.info("Cập nhật sản phẩm {}: Số lượng nhập = {}", maSanPham, soLuongNhap);
                productService.updateSoLuongCoTheNhap(maSanPham, soLuongNhap);
            }

            // Lưu phiếu nhập
            Receipt savedReceipt;
            try {
                savedReceipt = receiptService.save(receipt);
                logger.info("Tạo phiếu nhập thành công: {}", savedReceipt);
            } catch (Exception e) {
                logger.error("Lỗi khi lưu phiếu nhập: {}", e.getMessage(), e);
                throw new RuntimeException("Lỗi khi lưu phiếu nhập: " + e.getMessage(), e);
            }

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
    public ResponseEntity<Void> deleteReceipt(@PathVariable int id) {
        try {
            logger.info("Xóa phiếu nhập với ID: {}", id);
            receiptService.deleteById(id);
            logger.info("Xóa phiếu nhập thành công: {}", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa phiếu nhập với ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT: Cập nhật phiếu nhập
    @PutMapping("/receipts/{maPhieu}")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Quản lý kho')")
    public ResponseEntity<String> updateReceipt(
            @PathVariable("maPhieu") int maPhieu,
            @RequestBody ReceiptDTO receiptDTO) {
        try {
            logger.info("Cập nhật phiếu nhập với mã phiếu: {}", maPhieu);
            // Tìm phiếu nhập theo maPhieu
            Optional<Receipt> receiptOpt = receiptRepository.findById(maPhieu);
            if (!receiptOpt.isPresent()) {
                logger.warn("Phiếu nhập không tồn tại: {}", maPhieu);
                return new ResponseEntity<>("Phiếu nhập không tồn tại!", HttpStatus.NOT_FOUND);
            }

            Receipt receipt = receiptOpt.get();

            // Cập nhật nhà cung cấp
            Optional<NhaCungCap> nhaCungCapOpt = supplierRepository.findById(receiptDTO.getMaNhaCungCap());
            if (!nhaCungCapOpt.isPresent()) {
                logger.error("Nhà cung cấp không tồn tại: {}", receiptDTO.getMaNhaCungCap());
                return new ResponseEntity<>("Nhà cung cấp không tồn tại!", HttpStatus.NOT_FOUND);
            }
            receipt.setNhaCungCap(nhaCungCapOpt.get());

            // Cập nhật chi tiết phiếu nhập
            List<ReceiptDetail> existingDetails = receipt.getChiTietPhieuNhaps();
            List<ReceiptDetailDTO> updatedDetails = receiptDTO.getDetails();

            if (existingDetails.size() != updatedDetails.size()) {
                logger.error("Danh sách chi tiết không hợp lệ: Số lượng không khớp");
                return new ResponseEntity<>("Danh sách chi tiết không hợp lệ!", HttpStatus.BAD_REQUEST);
            }

            // Kiểm tra số lượng trước khi cập nhật
            for (int i = 0; i < existingDetails.size(); i++) {
                ReceiptDetail detail = existingDetails.get(i);
                ReceiptDetailDTO detailDTO = updatedDetails.get(i);

                // Kiểm tra maSanPham có khớp không
                if (!detail.getId().getMaSanPham().equals(detailDTO.getMaSanPham())) {
                    logger.error("Mã sản phẩm không khớp tại vị trí {}: {} != {}", i, detail.getId().getMaSanPham(),
                            detailDTO.getMaSanPham());
                    return new ResponseEntity<>("Mã sản phẩm không khớp!", HttpStatus.BAD_REQUEST);
                }

                // Tính sự thay đổi số lượng (delta)
                int oldSoLuong = detail.getSoLuong();
                int newSoLuong = detailDTO.getSoLuong();
                int delta = newSoLuong - oldSoLuong;
                logger.info("Sản phẩm {}: Số lượng cũ = {}, Số lượng mới = {}, Delta = {}",
                        detail.getId().getMaSanPham(), oldSoLuong, newSoLuong, delta);

                // Lấy sản phẩm từ bảng sanpham
                Product product = productService.findByMaSanPham(detail.getId().getMaSanPham());
                if (product == null) {
                    logger.error("Sản phẩm không tồn tại: {}", detail.getId().getMaSanPham());
                    return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
                }

                // Kiểm tra số lượng có thể nhập
                long soLuongCoTheNhap = product.getSoLuongCoTheNhap();
                if (delta > 0 && delta > soLuongCoTheNhap) {
                    logger.error("Số lượng nhập tăng thêm vượt quá số lượng có thể nhập cho sản phẩm: {}",
                            product.getMaSanPham());
                    return new ResponseEntity<>(
                            "Số lượng nhập tăng thêm (" + delta + ") vượt quá số lượng có thể nhập (" + soLuongCoTheNhap
                                    + ") cho sản phẩm " + product.getMaSanPham(),
                            HttpStatus.BAD_REQUEST);
                }

                // Kiểm tra số lượng tồn kho nếu giảm số lượng nhập
                int totalImported = receiptDetailRepository
                        .getTotalImportedQuantityByMaSanPham(detail.getId().getMaSanPham());
                int totalExported = exportReceiptDetailRepository
                        .getTotalExportedQuantityByMaSanPham(detail.getId().getMaSanPham());
                int currentSoLuongTonKho = totalImported - totalExported - oldSoLuong;
                if (delta < 0 && Math.abs(delta) > currentSoLuongTonKho) {
                    logger.error("Số lượng tồn kho không đủ để giảm cho sản phẩm: {}", product.getMaSanPham());
                    return new ResponseEntity<>(
                            "Số lượng tồn kho không đủ để giảm! Sản phẩm " + product.getMaSanPham() + " chỉ còn "
                                    + currentSoLuongTonKho + " đơn vị.",
                            HttpStatus.BAD_REQUEST);
                }
            }

            // Cập nhật chi tiết phiếu nhập và số lượng có thể nhập
            double tongTien = 0;
            for (int i = 0; i < existingDetails.size(); i++) {
                ReceiptDetail detail = existingDetails.get(i);
                ReceiptDetailDTO detailDTO = updatedDetails.get(i);

                // Tính lại delta
                int oldSoLuong = detail.getSoLuong();
                int newSoLuong = detailDTO.getSoLuong();
                int delta = newSoLuong - oldSoLuong;

                // Cập nhật số lượng trong ReceiptDetail
                detail.setSoLuong(newSoLuong);

                // Tính lại thành tiền
                double thanhTien = detail.getSoLuong() * detail.getDonGia();
                tongTien += thanhTien;

                // Cập nhật số lượng có thể nhập trong bảng sanpham
                String maSanPham = detail.getId().getMaSanPham();
                productService.updateSoLuongCoTheNhap(maSanPham, delta);

                // Lưu lại chi tiết phiếu nhập
                receiptDetailRepository.save(detail);
            }

            // Cập nhật tổng tiền của phiếu nhập
            receipt.setTongTien(tongTien);
            receiptRepository.save(receipt);

            logger.info("Cập nhật phiếu nhập thành công: {}", maPhieu);
            return new ResponseEntity<>("Cập nhật phiếu nhập thành công!", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật phiếu nhập với mã phiếu {}: {}", maPhieu, e.getMessage(), e);
            return new ResponseEntity<>("Lỗi khi cập nhật phiếu nhập: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}