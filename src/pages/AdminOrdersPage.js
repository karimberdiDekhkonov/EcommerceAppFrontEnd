import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Badge, Pagination } from "react-bootstrap";
import { fetchAdminOrders, confirmRefund } from "../services/orderService";
import { toast } from "react-toastify";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  const loadOrders = async (pageNumber) => {
    try {
      const data = await fetchAdminOrders(pageNumber, pageSize);
      setOrders(data.content || []);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleConfirmRefund = async (orderId) => {
    try {
      const res = await confirmRefund(orderId);
      toast.success(res.message || "Refund confirmed!");
      loadOrders(page); // refresh the current page
    } catch (error) {
      toast.error("Failed to confirm refund");
    }
  };

  return (
    <Container className="mt-4">
      <h3>All Customer Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4 p-3">
            <h5>
              Order ID: <span className="text-muted">{order.id}</span>
            </h5>
            <p>Status: <Badge bg="info">{order.status}</Badge></p>
            <p>Total: ${order.totalAmount.toFixed(2)}</p>
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Customer: {order.customerEmail}</p>
            <p>Shipping Address: {order.shippingAddress}</p>
            <hr />
            <strong>Items:</strong>
            <Row className="mt-2">
              {order.items.map((item, idx) => (
                <Col md={6} key={idx}>
                  <p>
                    • <strong>{item.name}</strong> — Qty: {item.quantity} — ${item.price.toFixed(2)}
                  </p>
                </Col>
              ))}
            </Row>

            {/* Show refund button if refund was requested */}
            {order.requestedRefund && order.status !== "REFUNDED" && (
              <Button variant="warning" onClick={() => handleConfirmRefund(order.id)}>
                Confirm Refund
              </Button>
            )}
          </Card>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={idx === page}
              onClick={() => setPage(idx)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </Container>
  );
};

export default AdminOrdersPage;
