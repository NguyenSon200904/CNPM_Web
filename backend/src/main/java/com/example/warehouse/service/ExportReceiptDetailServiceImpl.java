package com.example.warehouse.service;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;
import com.example.warehouse.repository.ExportReceiptDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExportReceiptDetailServiceImpl implements ExportReceiptDetailService {

  @Autowired
  private ExportReceiptDetailRepository exportReceiptDetailRepository;

  @Override
  public List<ExportReceiptDetail> findAll() {
    return exportReceiptDetailRepository.findAll();
  }

  @Override
  public ExportReceiptDetail findById(ExportReceiptDetailId id) {
    Optional<ExportReceiptDetail> detail = exportReceiptDetailRepository.findById(id);
    return detail.orElse(null);
  }

  @Override
  public ExportReceiptDetail save(ExportReceiptDetail detail) {
    return exportReceiptDetailRepository.save(detail);
  }

  @Override
  public void deleteById(ExportReceiptDetailId id) {
    exportReceiptDetailRepository.deleteById(id);
  }

  @Override
  public boolean existsById(ExportReceiptDetailId id) {
    return exportReceiptDetailRepository.existsById(id);
  }

  @Override
  public boolean existsByIdMaPhieuXuatAndIdMaSanPham(Long maPhieuXuat, String maSanPham) {
    ExportReceiptDetailId id = new ExportReceiptDetailId();
    id.setMaPhieuXuat(maPhieuXuat);
    id.setMaSanPham(maSanPham);
    return exportReceiptDetailRepository.existsById(id);
  }

  @Override
  public List<ExportReceiptDetail> findByIdMaPhieuXuat(Long maPhieuXuat) {
    return exportReceiptDetailRepository.findByIdMaPhieuXuat(maPhieuXuat);
  }
}