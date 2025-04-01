import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../services/cartService";
import { placeOrder } from "../services/orderService";
import { toast } from "react-toastify";

const PlaceOrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const items = await getCart();
    setCartItems(items || []);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderRequest = {
      items: cartItems,
    };

    try {
      const response = await placeOrder(orderRequest);
      toast.success("✅ Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Confirm Your Order</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Card className="p-3 my-3">
          <h5>Order Summary</h5>
          {cartItems.map((item, idx) => (
            <Row key={idx} className="mb-2">
              <Col md={6}>{item.name}</Col>
              <Col md={3}>Qty: {item.quantity}</Col>
              <Col md={3}>${item.price.toFixed(2)}</Col>
            </Row>
          ))}
          <hr />
          <h5>Total: ${calculateTotal()}</h5>
          <Button variant="success" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default PlaceOrderPage;
