import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProduct,
  saveProductWithImages,
  fetchCategories,
} from "../services/productService";
import { Form, Button, Container, Image } from "react-bootstrap";
import { toast } from "react-toastify";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    amountLeft: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [available, setAvailable] = useState(true); // ✔️ tracked separately

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load categories."));

    if (id) {
      fetchProduct(id)
        .then((data) => {
          setFormData({ ...data, images: [] });
          setCategory(data.category || "");
          setAvailable(data.available); // ✔️ set availability from server
          setImagePreviews(
            data.images?.map((img) => `data:image/png;base64,${img}`) || []
          );
        })
        .catch(() => toast.error("Failed to load product details."));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = customCategory.trim() || category.trim();
    if (!finalCategory) return toast.error("Please provide a category.");
    if (formData.images.length === 0 && !id) return toast.error("Upload at least one image.");

    const productToSave = {
      ...formData,
      category: finalCategory,
      available: id ? available : true, // ✔️ Only include availability for update
    };

    try {
      await saveProductWithImages(productToSave);
      toast.success(id ? "Product updated!" : "Product added!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save product.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>{id ? "Edit Product" : "Add Product"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select value={category} onChange={(e) => {
            setCategory(e.target.value);
            setCustomCategory("");
          }}>
            <option value="">Select existing category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
          <Form.Control
            type="text"
            placeholder="Or enter a new category"
            value={customCategory}
            onChange={(e) => {
              setCustomCategory(e.target.value);
              setCategory("");
            }}
            className="mt-2"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount Left</Form.Label>
          <Form.Control
            type="number"
            name="amountLeft"
            value={formData.amountLeft}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
          <div className="d-flex flex-wrap mt-2">
            {imagePreviews.map((src, i) => (
              <Image key={i} src={src} alt="preview" width="100" height="100" className="m-1" />
            ))}
          </div>
        </Form.Group>

        {id && (
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
          </Form.Group>
        )}

        <Button type="submit">{id ? "Update" : "Add"}</Button>
      </Form>
    </Container>
  );
};

export default AdminProductForm;
