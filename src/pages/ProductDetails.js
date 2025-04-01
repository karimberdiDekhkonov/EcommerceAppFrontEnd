import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { Container, Card, Button } from "react-bootstrap";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then((products) => {
      const foundProduct = products.find((p) => p.id === id);
      setProduct(foundProduct);
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Img variant="top" src={product.image} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text>Price: ${product.price}</Card.Text>
          <Button variant="success">Add to Cart</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetails;
