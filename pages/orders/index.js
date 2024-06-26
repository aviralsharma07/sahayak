import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";

const Orders = ({ allOrders }) => {
  //   console.log(allOrders[0].orderId);
  const [orders, setOrders] = useState(allOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);

  // Pagination Logic for Orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders?.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Delete Order Function by Order ID
  const handleDeleteOrder = async (orderId) => {
    console.log(orderId);
    try {
      const response = await fetch(`api/DeleteOrder?orderId=${orderId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Remove the deleted order from the state
      setOrders(orders.filter((order) => order.orderId !== orderId));
      toast({
        title: "Order Deleted Successfully",
        description: `Order ID: ${orderId}`,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="container flex flex-col p-12 min-h-screen max-w-full">
      <div className="mb-7 flex justify-between align-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Orders</h1>
        <div className="order-buttons flex align-center mt-1 gap-2">
          <Button onClick={() => router.push("orders/create")} variant="create">
            Create an Order
          </Button>
        </div>
      </div>
      {currentOrders?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Items</TableHead>
              <TableHead>User Address</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  {/* Render items */}
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        Product ID: {item.productId},<br /> Bought Quantity: {item.boughtQuantity}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  {/* Render user address */}
                  <div>
                    City: {order.userAddress.City},<br /> Country: {order.userAddress.Country},<br /> Zip Code: {order.userAddress.ZipCode}
                  </div>
                </TableCell>
                <TableCell>
                  <Button onClick={(e) => router.push(`orders/${order.orderId}`)} variant="update">
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteOrder(order.orderId)} variant="destructive">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No orders found</p>
      )}
      <Pagination className="mt-3">
        <PaginationContent>
          {currentPage !== 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href="#">{currentPage}</PaginationLink>
          </PaginationItem>
          {indexOfLastOrder < orders?.length && (
            <PaginationItem>
              <PaginationNext onClick={() => paginate(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await fetch("https://fastapi-ecommerce-api.onrender.com/orders/all?limit=100&offset=0");
    const allOrders = await response.json();

    return {
      props: { allOrders },
    };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return {
      props: { allOrders: [] },
    };
  }
};

export default Orders;
