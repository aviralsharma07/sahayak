import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const CreateProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
  });
  const [createdProductId, setCreatedProductId] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch("https://thingproxy.freeboard.io/fetch/https://fastapi-ecommerce-api.onrender.com/products/create", {
      const response = await fetch("/api/CreateProduct", {
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
      const responseData = await response.json();
      // console.log("responseData", responseData);
      const { productId } = responseData;
      // console.log("productId", productId);
      setCreatedProductId(productId);
      const handleToast = () => {
        toast({
          title: "Product Created Successful",
          description: `Product ID: ${createdProductId}`,
        });
      };
      handleToast();
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
            <a className="text-black cursor-pointer" onClick={(e) => router.push(`/products/${createdProductId}`)}>
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
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Product Name" type="text" name="name" value={product.name} onChange={handleChange} />
          <label className="mb-2">Product Price:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Product Price" type="number" name="price" value={product.price} onChange={handleChange} />
          <label className="mb-2">Product Quantity:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Product Quantity" type="number" name="quantity" value={product.quantity} onChange={handleChange} />
          <Button type="submit">Create Product</Button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateProductPage;
