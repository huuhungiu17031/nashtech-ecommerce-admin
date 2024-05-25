import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthenLayout from "./layout/AuthenLayout";
import { DashboardLayout, DefaultLayout } from "./layout";
import { Category, Chart, ListProduct, Login, Product } from "./components";
import { ListCategory } from "./components/category/ListCategory";


function App() {

  return (
    <Router>
      <Routes>
        <Route element={<AuthenLayout />}>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="product" element={
              <DashboardLayout>
                <Product />
              </DashboardLayout>
            }>
              <Route path="chart" element={<Chart />} />
              <Route path="list" element={<ListProduct />} />            
            </Route>
            <Route path="category" element={<DashboardLayout><Category /></DashboardLayout>}>
              <Route path="list" element={<ListCategory />} />
            </Route>
            <Route path="/" element={<Navigate to="product" />} />
          </Route>
        </Route>
        <Route element={<Login />} path="login"></Route>
      </Routes>
    </Router>
  )
}

export default App
