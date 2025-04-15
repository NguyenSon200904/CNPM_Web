import React from "react";
import { Button, Upload, message, Modal } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";

const ActionButtons = ({
  onAdd,
  onEdit,
  onDelete,
  onReset,
  onExport,
  onImport,
  isMobile,
  selectedRows,
  exportData,
}) => {
  // Hàm xử lý Xóa với xác nhận
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      message.warning("Vui lòng chọn một mục để xóa!");
      return;
    }
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa mục này?",
      onOk: () => {
        onDelete(selectedRows[0]);
      },
    });
  };

  // Hàm xử lý Xuất Excel
  const handleExportExcel = () => {
    if (!exportData || exportData.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
    message.success("Xuất file Excel thành công!");
  };

  // Hàm xử lý Nhập Excel
  const handleImportExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(worksheet);
      onImport(importedData);
    };
    reader.readAsBinaryString(file);
    return false;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="min-w-[100px] h-[50px]"
        onClick={onAdd}
      >
        Thêm
      </Button>
      <Button
        type="primary"
        icon={<EditOutlined />}
        className="min-w-[100px] h-[50px]"
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warning("Vui lòng chọn một mục để sửa!");
            return;
          }
          onEdit(selectedRows[0]);
        }}
      >
        Sửa
      </Button>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        className="min-w-[100px] h-[50px]"
        onClick={handleDelete}
      >
        Xóa
      </Button>
      {!isMobile && (
        <>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            className="min-w-[100px] h-[50px]"
            onClick={onReset}
          >
            Đặt lại
          </Button>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            className="min-w-[100px] h-[50px]"
            onClick={onExport || handleExportExcel}
          >
            Xuất Excel
          </Button>
          <Upload
            accept=".xlsx, .xls"
            showUploadList={false}
            beforeUpload={onImport ? handleImportExcel : () => false}
          >
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              className="min-w-[100px] h-[50px]"
              disabled={!onImport}
            >
              Nhập Excel
            </Button>
          </Upload>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
