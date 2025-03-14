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
    <div className="min-h-screen flex justify-center items-center p-6">
      <Card className="w-[500px] h-[500px] p-8 shadow-lg rounded-lg">
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="Thông tin" key="info">
            <div className="flex flex-col gap-5">
              <Input
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-[50px]"
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px]"
              />
              <Input.Password
                placeholder="Nhập mật khẩu để lưu thay đổi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[50px]"
              />
              <Button type="primary" className="h-[50px]">
                Lưu thay đổi
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Mật khẩu" key="password">
            <div className="flex flex-col gap-5">
              <Input.Password
                placeholder="Mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-[50px]"
              />
              <Input.Password
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-[50px]"
              />
              <Input.Password
                placeholder="Nhập lại mật khẩu mới"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="h-[50px]"
              />
              <Button type="primary" className="h-[50px]">
                Đổi mật khẩu
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ChangeInfo;
