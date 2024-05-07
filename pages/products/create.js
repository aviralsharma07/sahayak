import { useState } from "react";
import { Button } from "@/components/ui/button";
import cors from "cors";
import { useRouter } from "next/router";

const CreateProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
  });
  const [createdProductId, setCreatedProductId] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

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
    <div className="create-form border-2 border-red-300 w-screen h-screen flex justify-center items-center">
      {createdProductId ? (
        <div className="flex flex-col gap-5 ">
          <p className="text-fff-700 bg-green-600 p-5 rounded">
            Product created successfully!{" "}
            <a className="text-black" href={`https://fastapi-ecommerce-api.onrender.com/products/${createdProductId}`}>
              View Product
            </a>
          </p>
          <Button onClick={(e) => router.push("/products")} className="w-[180px] self-center">
            See All Products
          </Button>
        </div>
      ) : (
        <form className="flex border-2 rounded p-12 flex-col" onSubmit={handleSubmit}>
          <label className="mb-2">Product Name:</label>
          <input required className="p-5 mb-4 rounded" placeholder="Enter Product Name" type="text" name="name" value={product.name} onChange={handleChange} />
          <label className="mb-2">Product Price:</label>
          <input required className="p-5 mb-4 rounded" placeholder="Enter Product Price" type="number" name="price" value={product.price} onChange={handleChange} />
          <label className="mb-2">Product Quantity:</label>
          <input required className="p-5 mb-4 rounded" placeholder="Enter Product Quantity" type="number" name="quantity" value={product.quantity} onChange={handleChange} />
          <Button type="submit">Create Product</Button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateProductPage;
