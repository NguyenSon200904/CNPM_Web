import { useState } from "react";
import { Input, Button, Tabs, Card } from "antd";

const { TabPane } = Tabs;

const ChangeInfo = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [fullName, setFullName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("nguyenvana@example.com");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <div className="p-6">
      <Card className="max-w-lg mx-auto p-6">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin" key="info">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input.Password
                placeholder="Nhập mật khẩu để lưu thay đổi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="primary">Lưu thay đổi</Button>
            </div>
          </TabPane>
          <TabPane tab="Mật khẩu" key="password">
            <div className="flex flex-col gap-4">
              <Input.Password
                placeholder="Mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input.Password
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input.Password
                placeholder="Nhập lại mật khẩu mới"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <Button type="primary">Đổi mật khẩu</Button>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ChangeInfo;
