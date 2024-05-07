// import { useState } from "react";
// import { useRouter } from "next/router";
// import { Button } from "@/components/ui/button";

// const UpdatePage = ({ product }) => {
//   //   console.log(product);
//   const router = useRouter();
//   const { productId } = router.query;
//   const [formData, setFormData] = useState({
//     name: product?.name,
//     price: product?.price,
//     quantity: product?.quantity,
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`https://fastapi-ecommerce-api.onrender.com/products/${productId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update product");
//       }
//       const data = await response.json();
//       setMessage(data.message);
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Update Product</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input type="text" name="name" value={formData.name} onChange={handleChange} />
//         </label>
//         <label>
//           Price:
//           <input type="number" name="price" value={formData.price} onChange={handleChange} />
//         </label>
//         <label>
//           Quantity:
//           <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
//         </label>
//         <Button type="submit">Update Product</Button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export const getServerSideProps = async ({ params }) => {
//   try {
//     const { productId } = params;
//     const response = await fetch(`https://fastapi-ecommerce-api.onrender.com/products/${productId}`);
//     const product = await response.json();
//     return {
//       props: { product },
//     };
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return {
//       props: { product: {} },
//     };
//   }
// };

// export default UpdatePage;

// pages/products/[productId].js

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const ProductPage = ({ product }) => {
  const router = useRouter();
  const { productId } = router.query;
  console.log(productId);
  //   console.log(product);
  const [error, setError] = useState(null);
  const [name, setName] = useState(product?.name);
  const [price, setPrice] = useState(product?.price);
  const [quantity, setQuantity] = useState(product?.quantity);
  console.log(name, price, quantity);

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
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="border-2 border-red-600 h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="">Product Page</h1>
      <div className="flex flex-col gap-5">
        <h2>Product ID: {productId}</h2>
        <div>
          <label className="mr-2" htmlFor="name">
            Name:
          </label>
          <input className="p-2" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mr-2" htmlFor="price">
            Price:
          </label>
          <input className="p-2" id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="mr-2" htmlFor="quantity">
            Quantity:
          </label>
          <input className="p-2" id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <Button onClick={handleUpdateProduct}>Update Product</Button>
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
