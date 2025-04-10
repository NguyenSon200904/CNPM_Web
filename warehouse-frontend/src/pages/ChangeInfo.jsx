import { useState, useEffect } from "react";
import { Input, Button, Tabs, Card, Form, message } from "antd";
import axios from "axios";

const { TabPane } = Tabs;

const ChangeInfo = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Không tìm thấy token. Vui lòng đăng nhập lại!");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/current-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
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

  const handleSaveInfo = async (values) => {
    if (!user) {
      message.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Không tìm thấy token. Vui lòng đăng nhập lại!");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${user.userName}`,
        {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hiển thị thông báo thành công và reload trang
      message.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Reload sau 1 giây để người dùng thấy thông báo
    } catch (error) {
      console.error("Error updating user info:", error);
      if (error.response?.status === 403) {
        message.error("Bạn không có quyền thực hiện hành động này!");
      } else if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error === "Mật khẩu hiện tại không đúng!"
      ) {
        message.error("Mật khẩu sai!");
      } else {
        message.error(
          "Cập nhật thông tin thất bại: " +
            (error.response?.data?.error || error.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Không tìm thấy token. Vui lòng đăng nhập lại!");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${user.userName}/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hiển thị thông báo thành công và reload trang
      message.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Reload sau 1 giây để người dùng thấy thông báo
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response?.status === 403) {
        message.error("Bạn không có quyền thực hiện hành động này!");
      } else if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error === "Mật khẩu hiện tại không đúng!"
      ) {
        message.error("Mật khẩu sai!");
      } else {
        message.error(
          "Đổi mật khẩu thất bại: " +
            (error.response?.data?.error || error.message)
        );
      }
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
                  {
                    max: 50,
                    message: "Họ và tên không được vượt quá 50 ký tự!",
                  },
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
                  { max: 50, message: "Email không được vượt quá 50 ký tự!" },
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
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
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
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password className="h-[50px]" />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự!" },
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
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Mật khẩu mới và xác nhận mật khẩu không khớp!"
                        )
                      );
                    },
                  }),
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
