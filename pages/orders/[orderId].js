import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const OrderPage = ({ orders }) => {
  // console.log(orders);
  const router = useRouter();
  const { orderId } = router.query;
  const [error, setError] = useState(null);
  let [order, setOrder] = useState({
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
  const { toast } = useToast();

  useEffect(() => {
    // Find the order with the given orderId
    const foundOrder = orders.find((order) => order.orderId === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError("Order not found");
    }
  }, [orderId, orders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const { userAddress } = order;
    setOrder((prevOrder) => ({
      ...prevOrder,
      userAddress: {
        ...userAddress,
        [name]: value,
      },
    }));
  };

  const handleItemInputChange = (e, index) => {
    const { name, value } = e.target;
    const { items } = order;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: updatedItems,
    }));
  };

  const handleUpdateOrder = async () => {
    try {
      const response = await fetch(`/api/UpdateOrder?orderId=${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();
      console.log("Updated order:", updatedOrder);

      // Optionally, display a success message using the toast
      toast({
        title: "Order Updated Successfully",
        description: `Order ID: ${orderId}`,
      });

      // Redirect to a different page or perform any other action after successful update
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <div className="border-2 pr-20 pl-20 pt-10 pb-10">
        <h1 className="mb-3 text-xl">Update Order</h1>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mr-2">Items:</label>
            {order.items.map((item, index) => (
              <div key={index}>
                <Input className="mt-2" type="text" name="productId" value={item.productId} onChange={(e) => handleItemInputChange(e, index)} placeholder="Enter product ID" />
                <Input className="mt-2" type="number" name="boughtQuantity" value={item.boughtQuantity} onChange={(e) => handleItemInputChange(e, index)} placeholder="Enter bought quantity" />
              </div>
            ))}
          </div>
          <div>
            <label className="mr-2">User Address:</label>
            <Input className="mt-1" type="text" name="City" value={order.userAddress.City} onChange={handleInputChange} placeholder="Enter City" />
            <Input className="mt-1" type="text" name="Country" value={order.userAddress.Country} onChange={handleInputChange} placeholder="Enter Country" />
            <Input className="mt-1" type="text" name="ZipCode" value={order.userAddress.ZipCode} onChange={handleInputChange} placeholder="Enter Zip Code" />
          </div>
          <Button onClick={handleUpdateOrder}>Update Order</Button>
          <Button onClick={() => router.push("/orders")}>View All Orders</Button>
          <Button onClick={() => router.push("/orders/create")} variant="create">
            Create new Order
          </Button>
        </div>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

// Fetch all orders from the API
export const getServerSideProps = async () => {
  const response = await fetch("https://fastapi-ecommerce-api.onrender.com/orders/all?limit=100&offset=0");
  const data = await response.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { orders: data },
  };
};

export default OrderPage;
