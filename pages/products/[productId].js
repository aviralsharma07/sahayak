import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const ProductPage = ({ product }) => {
  const router = useRouter();
  const { productId } = router.query;
  //   console.log(productId);
  //   console.log(product);
  const [error, setError] = useState(null);
  const [name, setName] = useState(product?.name);
  const [price, setPrice] = useState(product?.price);
  const [quantity, setQuantity] = useState(product?.quantity);
  //   console.log(name, price, quantity);
  const { toast } = useToast();

  // Update Product
  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`/api/UpdateProduct?productId=${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: price,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const successMessage = await response.json();
      console.log("Success:", successMessage);
      const handleToast = () => {
        toast({
          title: "Product Update Successful",
          description: `Product ID: ${productId}`,
        });
      };
      handleToast();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <div className="border-2 p-12 pr-20 pl-20">
        <h1 className="mb-5 sm:text-lg md:text-xl lg:text-2xl xl:text-4xl">Product Page</h1>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mr-2" htmlFor="name">
              Name:
            </label>
            <Input className="p-2 mt-2" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}></Input>
          </div>
          <div>
            <label className="mr-2" htmlFor="price">
              Price:
            </label>
            <Input className="p-2 mt-2" id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="mr-2" htmlFor="quantity">
              Quantity:
            </label>
            <Input className="p-2 mt-2" id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <Button variant="update" onClick={handleUpdateProduct}>
            Update Product
          </Button>
          <Button onClick={() => router.push("/products")}>View All Products</Button>
          <Button onClick={() => router.push("/products/create")} variant="create">
            Create Product
          </Button>
        </div>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  try {
    const { productId } = params;
    const response = await fetch(`https://fastapi-ecommerce-api.onrender.com/products/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const product = await response.json();
    return {
      props: { product },
    };
  } catch (error) {
    return {
      props: { product: {} }, // Return empty object in case of error
    };
  }
};

export default ProductPage;
