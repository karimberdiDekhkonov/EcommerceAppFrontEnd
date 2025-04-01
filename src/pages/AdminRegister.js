import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerAdmin } from "../services/adminService";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

const AdminRegister = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ Extract token from URL

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerAdmin({ ...formData, token }); // ✅ No email needed

      if (response.success) {
        toast.success(response.message);
        navigate("/login");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Registration failed. The token might be expired.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Registration</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </Container>
  );
};

export default AdminRegister;
