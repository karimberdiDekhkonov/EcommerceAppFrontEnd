import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function NavbarComponent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Check roles as array
  const storedRoles = localStorage.getItem("roles");
  const roles = storedRoles ? JSON.parse(storedRoles) : [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  const handleLogout = async () => {
    if (!token) {
      toast.error("You are already logged out!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        navigate("/login");
      } else {
        toast.error("Logout failed: " + response.data.message);
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && isAdmin ? (
            // 🔐 Admin Navbar
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/admin/products">Manage Products</Nav.Link>
                <Nav.Link as={Link} to="/admin/orders">Manage Orders</Nav.Link>
                <Nav.Link as={Link} to="/admin/invite">Invite Admin</Nav.Link>
                <Nav.Link as={Link} to="/products">User Products</Nav.Link>
                <Nav.Link as={Link} to="/cart">User Cart</Nav.Link>
                {token && <Nav.Link as={Link} to="/orders">User Orders</Nav.Link>}
              </Nav>
              <Nav>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
              </Nav>
            </>
          ) : (
            // 👤 Customer Navbar
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/products">Products</Nav.Link>
                <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                {token && <Nav.Link as={Link} to="/orders">Orders</Nav.Link>}
              </Nav>
              <Nav>
                {!token ? (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  </>
                ) : (
                  <Button variant="danger" onClick={handleLogout}>Logout</Button>
                )}
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
