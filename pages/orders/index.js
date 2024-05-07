import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Orders = ({ allOrders }) => {
  //   console.log(allOrders[0].userAddress);
  const [orders, setOrders] = useState(allOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const router = useRouter();

  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders?.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container flex flex-col p-10 border-2 border-solid border-red-500 min-h-screen max-w-full">
      <div className="mb-7 border-2 border-solid border-blue-500 flex justify-between align-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Orders</h1>
        <div className="order-buttons flex align-center mt-1 gap-2">
          <Button onClick={() => router.push("orders/create")} variant="create">
            Create an Order
          </Button>
        </div>
      </div>
      {currentOrders?.length > 0 ? (
        <Table>
          <TableCaption>Orders</TableCaption>
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
                  <Button onClick={() => router.push(`orders/${order.id}`)} variant="update">
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`orders/update/${order.id}`)} variant="destructive">
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
      <Pagination>
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
