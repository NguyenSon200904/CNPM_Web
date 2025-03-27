import { useState, useEffect } from "react";
import { Input, Button, Tabs, Card, Form, message } from "antd";
import axios from "axios";

const { TabPane } = Tabs;

const ChangeInfo = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [loading, setLoading] = useState(false);
  const [infoForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/current-user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Giả sử token được lưu trong localStorage
            },
          }
        );
        setUser(response.data);
        // Cập nhật giá trị ban đầu cho form
        infoForm.setFieldsValue({
          fullName: response.data.fullName,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching current user:", error);
        message.error(
          "Không thể tải thông tin người dùng: " +
            (error.response?.data?.error || error.message)
        );
      }
    };
    fetchCurrentUser();
  }, [infoForm]);

  // Xử lý lưu thay đổi thông tin
  const handleSaveInfo = async (values) => {
    if (!user) {
      message.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/users/${user.userName}`,
        {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Cập nhật thông tin thành công!");
      setUser({ ...user, fullName: values.fullName, email: values.email });
    } catch (error) {
      console.error("Error updating user info:", error);
      message.error(
        "Cập nhật thông tin thất bại: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values) => {
    if (!user) {
      message.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/users/${user.userName}/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(
        "Đổi mật khẩu thất bại: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <Card className="w-[500px] h-[500px] p-8 shadow-lg rounded-lg">
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="Thông tin" key="info">
            <Form
              form={infoForm}
              onFinish={handleSaveInfo}
              layout="vertical"
              className="flex flex-col gap-5"
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input className="h-[50px]" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input className="h-[50px]" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu hiện tại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu hiện tại!",
                  },
                ]}
              >
                <Input.Password className="h-[50px]" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-[50px] w-full"
                  loading={loading}
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Mật khẩu" key="password">
            <Form
              form={passwordForm}
              onFinish={handleChangePassword}
              layout="vertical"
              className="flex flex-col gap-5"
            >
              <Form.Item
                name="currentPassword"
                label="Mật khẩu hiện tại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu hiện tại!",
                  },
                ]}
              >
                <Input.Password className="h-[50px]" />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password className="h-[50px]" />
              </Form.Item>
              <Form.Item
                name="confirmNewPassword"
                label="Nhập lại mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu mới!",
                  },
                ]}
              >
                <Input.Password className="h-[50px]" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-[50px] w-full"
                  loading={loading}
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ChangeInfo;
