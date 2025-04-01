import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Pagination,
  Carousel,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchAvailableProducts, fetchCategories } from "../services/productService";
import { addToCart } from "../services/cartService";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: "", minPrice: "", maxPrice: "" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCategories().then(setCategories);
    loadProducts(0);
  }, []);

  const loadProducts = async (pageToLoad) => {
    const params = {
      page: pageToLoad,
      size: 9,
      ...filters,
    };

    const data = await fetchAvailableProducts(params);
    setProducts(data.content || []);
    setTotalPages(data.totalPages);
    setPage(data.number);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    loadProducts(0);
  };

  const handleAddToCart = async (product) => {
    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || null,
    };

    try {
      const response = await addToCart(item);
      if (response?.success) {
        toast.success(`✅ ${response.message}`);
      } else {
        toast.error(`❌ ${response?.message || "Failed to add to cart"}`);
      }
    } catch (err) {
      toast.error("❌ Failed to add to cart");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Browse Our Products</h2>

      {/* Filters */}
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={3}>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </Col>
        </Row>
      </Form>

      {/* Products */}
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card>
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Carousel indicators={false} interval={3000}>
                  {(product.images || []).map((img, i) => (
                    <Carousel.Item key={i}>
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`Slide ${i}`}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  {product.description.substring(0, 80)}...
                  <br />
                  <strong>${product.price}</strong> | Left: {product.amountLeft}
                </Card.Text>
                <Button variant="primary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx === page}
            onClick={() => loadProducts(idx)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default ProductCatalog;
