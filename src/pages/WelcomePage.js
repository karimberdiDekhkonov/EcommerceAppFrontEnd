import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to Our Shop</h1>
      <p>Please register or log in to browse products.</p>
      <Button as={Link} to="/login" variant="primary" className="m-2">
        Login
      </Button>
      <Button as={Link} to="/register" variant="success">
        Register
      </Button>
    </Container>
  );
};

export default WelcomePage;
