import { useState } from "react";
import { Button } from "@/components/ui/button";

const CreateProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
  });
  const [createdProductId, setCreatedProductId] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://thingproxy.freeboard.io/fetch/https://fastapi-ecommerce-api.onrender.com/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const { productId } = await response.json();
      console.log("productId", productId);
      console.log("response", response);
      setCreatedProductId(productId);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {createdProductId ? (
        <p>
          Product created successfully! <a href={`https://fastapi-ecommerce-api.onrender.com/products/${createdProductId}`}>View Product</a>
        </p>
      ) : (
        <form className="flex" onSubmit={handleSubmit}>
          <input type="text" name="name" value={product.name} onChange={handleChange} />
          <input type="number" name="price" value={product.price} onChange={handleChange} />
          <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
          <Button type="submit">Create Product</Button>
          {error && <p>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateProductPage;
