import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    shippingAddress: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({ ...formData, role: "USER" });
      if (response.success) {
        toast.success(response.message);
        setMessage(response.message);
        setError(null);
        setTimeout(() => navigate("/login"), 3000); // Redirect after success
      } else {
        setError(response.message);
        setMessage(null);
      }
    } catch (err) {
      setError(err);
      setMessage(null);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Register</h2>
      {message && <Alert variant="success">{message}</Alert>}
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
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Shipping Address</Form.Label>
          <Form.Control type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </Container>
  );
}

export default RegisterPage;
