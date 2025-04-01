import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import { getCustomerOrders, requestRefund } from "../services/orderService";
import { toast } from "react-toastify";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getCustomerOrders();
      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    }
  };

  const handleRequestRefund = async (orderId) => {
    try {
      await requestRefund(orderId);
      toast.success("Refund requested successfully.");
      loadOrders(); // Refresh after update
    } catch (err) {
      toast.error("Failed to request refund.");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Your Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3 p-3">
            <h5>Order ID: {order.id}</h5>
            <p>Status: <Badge bg="info">{order.status}</Badge></p>
            <p>Total: ${order.totalAmount.toFixed(2)}</p>
            <p>Placed At: {new Date(order.createdAt).toLocaleString()}</p>

            {order.status === "DELIVERED" && !order.requestedRefund && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleRequestRefund(order.id)}
              >
                Request Refund
              </Button>
            )}

            {order.requestedRefund && (
              <p className="text-warning mt-2">
                Refund Requested (awaiting admin confirmation)
              </p>
            )}

            <hr />
            <Row>
              {order.items.map((item, idx) => (
                <Col md={6} key={idx}>
                  <p>
                    <strong>{item.name}</strong> — Qty: {item.quantity} — ${item.price}
                  </p>
                </Col>
              ))}
            </Row>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderHistoryPage;
