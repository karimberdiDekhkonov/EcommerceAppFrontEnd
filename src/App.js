import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminRegister from "./pages/AdminRegister"; 
import WelcomePage from "./pages/WelcomePage";
import NavbarComponent from "./components/NavbarComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminInvite from "./pages/AdminInvite";
import AdminOrdersPage from "./pages/AdminOrdersPage";



function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Protected Routes for Users */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard (Now using ProtectedRoute with adminOnly=true) */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/invite" element={
           <ProtectedRoute adminOnly={true}>
            <AdminInvite />
           </ProtectedRoute>
          }/>

          <Route path="/admin/orders" element={
           <ProtectedRoute adminOnly={true}>
            <AdminOrdersPage />
           </ProtectedRoute>
          }/>

          {/* Admin Registration Route */}
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/place-order"element={
            <ProtectedRoute>
              <PlaceOrderPage />
            </ProtectedRoute>
          }/>
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }/>
    
        </Routes>
      </Router>
    </>
  );
}

export default App;
