import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CategoryForm, CategoryTable, ProductTable, Login, ProductFormPage, UserTable } from './components';
import { DefaultLayout } from './layout';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<AuthOutlet fallbackPath={'login'} />}>
                    <Route element={<DefaultLayout />}>
                        <Route path="category" element={<CategoryTable />} />
                        <Route path="category/form/:id" element={<CategoryForm />} />
                        <Route path="product" element={<ProductTable />} />
                        <Route path="product/form/:id" element={<ProductFormPage />} />
                        <Route path="user" element={<UserTable />} />
                        <Route path="category/form" element={<Navigate to="/category" />} />
                        <Route path="/" element={<Navigate to="/category" />} />
                    </Route>
                </Route>
                <Route element={<Login />} path="login"></Route>
            </Routes>
        </Router>
    );
}

export default App;
