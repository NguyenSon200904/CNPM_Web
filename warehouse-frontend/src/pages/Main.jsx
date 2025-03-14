import Sidebar from "../components/Sidebar";

const Main = ({ children }) => {
  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 overflow-hidden p-4">
        {children || (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold text-gray-800">
              Chào mừng đến với hệ thống quản lý kho
            </h1>
            <p className="text-lg text-gray-600">
              Chọn một mục từ thanh điều hướng để bắt đầu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
