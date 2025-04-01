import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { inviteAdmin } from "../services/adminService";
import { toast } from "react-toastify";

const AdminInvite = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteAdmin = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await inviteAdmin(email);

      if (response.success) {
        setMessage(response.message);
        setMessageType("success");
        toast.success(response.message);
        setEmail("");
      } else {
        setMessage(response.message);
        setMessageType("danger");
        toast.error(response.message);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to send invitation.";
      setMessage(msg);
      setMessageType("danger");
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Invite a New Admin</h3>
      {message && <Alert variant={messageType}>{message}</Alert>}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleInviteAdmin();
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading || !email}>
          {isLoading ? "Sending..." : "Send Invitation"}
        </Button>
      </Form>
    </Container>
  );
};

export default AdminInvite;
