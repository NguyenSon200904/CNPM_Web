import { Modal } from "antd";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Xác nhận đăng xuất"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      width={400} // Tăng kích thước hộp thoại
      centered // Giúp căn giữa màn hình
    >
      <p>Bạn có chắc chắn muốn đăng xuất không?</p>
    </Modal>
  );
};

export default LogoutModal;
