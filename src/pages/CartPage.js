import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert
} from "react-bootstrap";
import {
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from "../services/cartService";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const items = await getCart();
    setCartItems(items);
  };

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) return;
    await updateCartItem(productId, newQty);
    loadCart();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    loadCart();
  };

  const handleClearCart = async () => {
    await clearCart();
    loadCart();
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Container className="mt-4">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <Alert variant="info">Your cart is empty.</Alert>
      ) : (
        <>
          <Row>
            {cartItems.map((item) => (
              <Col md={12} key={item.productId} className="mb-3">
                <Card className="p-2 d-flex flex-row align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    {item.image && (
                      <img
                        src={`data:image/png;base64,${item.image}`}
                        alt={item.name}
                        style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "16px" }}
                      />
                    )}
                    <div>
                      <h5>{item.name}</h5>
                      <p className="mb-1">Price: ${item.price}</p>
                      <p className="mb-1">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</Button>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, parseInt(e.target.value))
                      }
                      style={{ width: "60px" }}
                    />
                    <Button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</Button>
                    <Button variant="danger" onClick={() => handleRemove(item.productId)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ${totalPrice.toFixed(2)}</h4>
            <Button variant="primary" onClick={() => navigate("/place-order")}>
              Proceed to Checkout
            </Button>
            <Button variant="outline-danger" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;
