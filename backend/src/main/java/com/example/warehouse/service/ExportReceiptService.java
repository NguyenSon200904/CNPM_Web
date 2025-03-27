package com.example.warehouse.service;

import com.example.warehouse.model.Account;
import com.example.warehouse.model.ExportReceipt;
import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.Product;
import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.repository.AccountRepository;
import com.example.warehouse.repository.ExportReceiptRepository;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.repository.ReceiptRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExportReceiptService {

    private static final Logger logger = LoggerFactory.getLogger(ExportReceiptService.class);

    @Autowired
    private ExportReceiptRepository exportReceiptRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private AccountRepository accountRepository;

    public ExportReceipt findById(Long id) {
        return exportReceiptRepository.findById(id).orElse(null);
    }

    @Transactional
    public List<ExportReceipt> findAll() {
        List<ExportReceipt> receipts = exportReceiptRepository.findAll();
        receipts.forEach(receipt -> {
            // Ép Hibernate tải các mối quan hệ liên quan trong cùng phiên
            if (receipt.getNguoiTao() != null) {
                receipt.getNguoiTao().getUserName(); // Force loading NguoiTao
            }
            if (receipt.getChiTietPhieuXuats() != null) {
                receipt.getChiTietPhieuXuats().size(); // Force loading ChiTietPhieuXuats
                receipt.getChiTietPhieuXuats().forEach(detail -> {
                    if (detail.getSanPham() != null) {
                        detail.getSanPham().getMaSanPham(); // Force loading SanPham trong ChiTietPhieuXuat
                    }
                });
            }
            logger.info("ExportReceipt: " + receipt.getMaPhieuXuat() +
                    ", NguoiTao: " + (receipt.getNguoiTao() != null ? receipt.getNguoiTao().getUserName() : "null"));
        });
        return receipts;
    }

    @Transactional
    public ExportReceipt save(ExportReceipt receipt) {
        logger.info("Dữ liệu phiếu xuất nhận được: {}", receipt);

        // Kiểm tra và gán nguoiTao
        if (receipt.getNguoiTao() != null && receipt.getNguoiTao().getUserName() != null) {
            Account nguoiTao = accountRepository.findById(receipt.getNguoiTao().getUserName())
                    .orElseThrow(() -> new RuntimeException(
                            "Người tạo không tồn tại: " + receipt.getNguoiTao().getUserName()));
            receipt.setNguoiTao(nguoiTao);
        } else {
            logger.error("Người tạo không hợp lệ: {}", receipt.getNguoiTao());
            throw new IllegalArgumentException("Người tạo là bắt buộc cho phiếu xuất.");
        }

        // Kiểm tra chiTietPhieuXuats
        List<ExportReceiptDetail> details = (receipt.getChiTietPhieuXuats() != null)
                ? new ArrayList<>(receipt.getChiTietPhieuXuats())
                : new ArrayList<>();

        // Kiểm tra logic nghiệp vụ: phiếu xuất phải có ít nhất một chi tiết
        if (details.isEmpty()) {
            logger.error("Danh sách chi tiết phiếu xuất rỗng: {}", receipt.getChiTietPhieuXuats());
            throw new IllegalArgumentException("Phiếu xuất phải có ít nhất một chi tiết phiếu xuất.");
        }

        // Tính số lượng tồn kho thực tế
        Map<String, Integer> importQuantities = new HashMap<>();
        Map<String, Integer> exportQuantities = new HashMap<>();

        // Tính tổng số lượng nhập
        receiptRepository.findAll().forEach(r -> {
            if (r.getChiTietPhieuNhaps() != null) {
                for (ReceiptDetail detail : r.getChiTietPhieuNhaps()) {
                    String maSanPham = detail.getId().getMaSanPham();
                    importQuantities.put(maSanPham, importQuantities.getOrDefault(maSanPham, 0) + detail.getSoLuong());
                }
            }
        });

        // Tính tổng số lượng xuất
        exportReceiptRepository.findAll().forEach(r -> {
            if (r.getChiTietPhieuXuats() != null) {
                for (ExportReceiptDetail detail : r.getChiTietPhieuXuats()) {
                    String maSanPham = detail.getId().getMaSanPham();
                    exportQuantities.put(maSanPham, exportQuantities.getOrDefault(maSanPham, 0) + detail.getSoLuong());
                }
            }
        });

        // Kiểm tra từng chi tiết phiếu xuất
        for (ExportReceiptDetail detail : details) {
            if (detail.getId() == null || detail.getId().getMaSanPham() == null) {
                logger.error("Chi tiết phiếu xuất không hợp lệ, thiếu mã sản phẩm: {}", detail);
                throw new IllegalArgumentException("Chi tiết phiếu xuất không hợp lệ: thiếu mã sản phẩm.");
            }
            Product product = productRepository.findById(detail.getId().getMaSanPham())
                    .orElseThrow(
                            () -> new RuntimeException("Sản phẩm không tồn tại: " + detail.getId().getMaSanPham()));

            // Tính số lượng tồn kho thực tế
            int imported = importQuantities.getOrDefault(product.getMaSanPham(), 0);
            int exported = exportQuantities.getOrDefault(product.getMaSanPham(), 0);
            int soLuongTonKho = imported - exported;

            if (detail.getSoLuong() > soLuongTonKho) {
                logger.error("Số lượng xuất vượt quá tồn kho: {} (tồn kho: {})", detail.getSoLuong(), soLuongTonKho);
                throw new IllegalArgumentException(
                        "Số lượng xuất (" + detail.getSoLuong() + ") vượt quá số lượng tồn kho (" + soLuongTonKho
                                + ") cho sản phẩm " + product.getTenSanPham());
            }
        }

        // Lưu ExportReceipt trước để tạo maPhieuXuat
        receipt.setChiTietPhieuXuats(null); // Tạm thời bỏ chiTietPhieuXuats để tránh lỗi cascade
        ExportReceipt savedReceipt = exportReceiptRepository.save(receipt);

        // Gán lại chiTietPhieuXuats và cập nhật maPhieuXuat
        for (ExportReceiptDetail detail : details) {
            // Gán maPhieuXuat vào ExportReceiptDetailId
            detail.getId().setMaPhieuXuat(savedReceipt.getMaPhieuXuat());
            detail.setExportReceipt(savedReceipt);

            // Tìm và gán Product
            Product product = productRepository.findById(detail.getId().getMaSanPham())
                    .orElseThrow(
                            () -> new RuntimeException("Sản phẩm không tồn tại: " + detail.getId().getMaSanPham()));
            detail.setSanPham(product);

            // Cập nhật số lượng sản phẩm trong bảng sanpham (giảm đi)
            product.setSoLuong(product.getSoLuong() - detail.getSoLuong());
            productRepository.save(product);
        }

        // Gán lại chiTietPhieuXuats và lưu
        savedReceipt.setChiTietPhieuXuats(details);
        ExportReceipt finalReceipt = exportReceiptRepository.save(savedReceipt);
        logger.info("Lưu phiếu xuất thành công: {}", finalReceipt);
        return finalReceipt;
    }

    @Transactional
    public void deleteById(Long id) {
        ExportReceipt receipt = exportReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phiếu xuất không tồn tại: " + id));
        // Cập nhật số lượng sản phẩm trước khi xóa (tăng lại số lượng)
        for (ExportReceiptDetail detail : receipt.getChiTietPhieuXuats()) {
            Product product = productRepository.findById(detail.getId().getMaSanPham())
                    .orElseThrow(
                            () -> new RuntimeException("Sản phẩm không tồn tại: " + detail.getId().getMaSanPham()));
            product.setSoLuong(product.getSoLuong() + detail.getSoLuong());
            productRepository.save(product);
        }
        exportReceiptRepository.deleteById(id);
    }

    public List<ExportReceipt> findByNguoiTaoUserName(String userName) {
        return exportReceiptRepository.findByNguoiTaoUserName(userName);
    }

    public List<ExportReceipt> findByNgayXuatBetween(LocalDateTime start, LocalDateTime end) {
        return exportReceiptRepository.findByNgayXuatBetween(start, end);
    }

    public Double getTotalExportAmount() {
        Double total = exportReceiptRepository.getTotalExportAmount();
        return total != null ? total : 0.0;
    }

    public Double getTotalExportAmountByNgayXuatBetween(LocalDateTime start, LocalDateTime end) {
        Double total = exportReceiptRepository.getTotalExportAmountByNgayXuatBetween(start, end);
        return total != null ? total : 0.0;
    }
}