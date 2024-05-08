import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const CreateOrderPage = () => {
  const [order, setOrder] = useState({
    items: [
      {
        productId: "",
        boughtQuantity: 0,
      },
    ],
    userAddress: {
      City: "",
      Country: "",
      ZipCode: "",
    },
  });
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();
  const { toast } = useToast();

  // Handle Change Event for Product ID and Bought Quantity
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: [
        {
          ...prevOrder.items[0],
          [name]: value,
        },
      ],
    }));
  };

  // Handle Address Change Event for City, Country, and Zip Code
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      userAddress: {
        ...prevOrder.userAddress,
        [name]: value,
      },
    }));
  };

  // Create Order Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/CreateOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const responseData = await response.json();
      const { orderId } = responseData;
      setCreatedOrderId(orderId);
      const handleToast = () => {
        toast({
          title: "Order Created Successfully",
          description: `Order ID: ${createdOrderId}`,
        });
      };
      handleToast();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="create-form w-screen h-screen flex justify-center items-center">
      {createdOrderId ? (
        <div className="flex flex-col gap-5 ">
          <p className="text-fff-700 bg-green-600 p-5 rounded">Order created successfully!</p>
          <Button onClick={(e) => router.push("/orders")} className="w-[180px] self-center">
            See All Orders
          </Button>
        </div>
      ) : (
        <form className="flex border-2 rounded p-12 flex-col" onSubmit={handleSubmit}>
          <label className="mb-2">Product ID:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Product ID" type="text" name="productId" value={order.items[0].productId} onChange={handleChange} />
          <label className="mb-2">Bought Quantity:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Bought Quantity" type="number" name="boughtQuantity" value={order.items[0].boughtQuantity} onChange={handleChange} />
          <label className="mb-2">City:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter City" type="text" name="City" value={order.userAddress.City} onChange={handleAddressChange} />
          <label className="mb-2">Country:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Country" type="text" name="Country" value={order.userAddress.Country} onChange={handleAddressChange} />
          <label className="mb-2">Zip Code:</label>
          <Input required className="p-5 mb-4 rounded" placeholder="Enter Zip Code" type="text" name="ZipCode" value={order.userAddress.ZipCode} onChange={handleAddressChange} />
          <Button type="submit">Create Order</Button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateOrderPage;
