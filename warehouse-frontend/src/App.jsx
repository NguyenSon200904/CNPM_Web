import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import Main from "./pages/Main.jsx";
import Login from "./pages/Login.jsx";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import ImportGoods from "./pages/ImportGoods";
import ImportReceipts from "./pages/ImportReceipts";
import ExportGoods from "./pages/ExportGoods";
import ExportReceipts from "./pages/ExportReceipts";
import Inventory from "./pages/Inventory";
import Accounts from "./pages/Accounts";
import Statistics from "./pages/Statistics";
import ChangeInfo from "./pages/ChangeInfo";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Arial', sans-serif",
        },
      }}
    >
      <AntdApp>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/san-pham"
            element={
              <ProtectedRoute>
                <Main>
                  <Products />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nha-cung-cap"
            element={
              <ProtectedRoute>
                <Main>
                  <Suppliers />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nhap-hang"
            element={
              <ProtectedRoute>
                <Main>
                  <ImportGoods />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/phieu-nhap"
            element={
              <ProtectedRoute>
                <Main>
                  <ImportReceipts />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/xuat-hang"
            element={
              <ProtectedRoute>
                <Main>
                  <ExportGoods />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/phieu-xuat"
            element={
              <ProtectedRoute>
                <Main>
                  <ExportReceipts />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ton-kho"
            element={
              <ProtectedRoute>
                <Main>
                  <Inventory />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tai-khoan"
            element={
              <ProtectedRoute>
                <Main>
                  <Accounts />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/thong-ke"
            element={
              <ProtectedRoute>
                <Main>
                  <Statistics />
                </Main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doi-thong-tin"
            element={
              <ProtectedRoute>
                <Main>
                  <ChangeInfo />
                </Main>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
