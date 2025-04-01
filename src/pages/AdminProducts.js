import React, { useEffect, useState } from "react";
import { fetchProducts, toggleAvailability } from "../services/productService";
import { Container, Table, Image, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const loadProducts = async (pageNumber) => {
    try {
      const data = await fetchProducts(pageNumber, pageSize);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await toggleAvailability(id);
      toast.success("Product availability updated.");

      // Optimistically update UI without full reload
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, available: !product.available } : product
        )
      );
    } catch (error) {
      toast.error("Failed to update availability.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Manage Products</h2>

      <Button as={Link} to="/admin/products/add" variant="success" className="mb-3">
        Add Product
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Images</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {product.images.map((img, idx) => (
                  <Image
                    key={`${product.id}-img-${idx}`}
                    src={`data:image/png;base64,${img}`}
                    width="50"
                    height="50"
                    className="m-1"
                    alt="product"
                  />
                ))}
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.available ? "Yes" : "No"}</td>
              <td>
                <Button
                  variant={product.available ? "danger" : "success"}
                  onClick={() => handleToggleAvailability(product.id)}
                >
                  {product.available ? "Mark Unavailable" : "Mark Available"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination-controls d-flex justify-content-between mt-3">
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
        <span> Page {page + 1} of {totalPages} </span>
        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </Container>
  );
};

export default AdminProducts;
