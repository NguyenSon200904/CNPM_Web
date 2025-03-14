import "./App.css";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/san-pham"
        element={
          <Main>
            <Products />
          </Main>
        }
      />
      <Route
        path="/nha-cung-cap"
        element={
          <Main>
            <Suppliers />
          </Main>
        }
      />
      <Route
        path="/nhap-hang"
        element={
          <Main>
            <ImportGoods />
          </Main>
        }
      />
      <Route
        path="/phieu-nhap"
        element={
          <Main>
            <ImportReceipts />
          </Main>
        }
      />
      <Route
        path="/xuat-hang"
        element={
          <Main>
            <ExportGoods />
          </Main>
        }
      />
      <Route
        path="/phieu-xuat"
        element={
          <Main>
            <ExportReceipts />
          </Main>
        }
      />
      <Route
        path="/ton-kho"
        element={
          <Main>
            <Inventory />
          </Main>
        }
      />
      <Route
        path="/tai-khoan"
        element={
          <Main>
            <Accounts />
          </Main>
        }
      />
      <Route
        path="/thong-ke"
        element={
          <Main>
            <Statistics />
          </Main>
        }
      />
      <Route
        path="/doi-thong-tin"
        element={
          <Main>
            <ChangeInfo />
          </Main>
        }
      />
    </Routes>
  );
}

export default App;
