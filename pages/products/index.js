// "use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

const Products = ({ allProducts }) => {
  const [products, setProducts] = useState(allProducts.data);
  const [filteredProducts, setFilteredProducts] = useState(allProducts.data);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const productsPerPage = 4;
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    sortProducts(event.target.value, sortOrder);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    sortProducts(sortBy, sortOrder === "asc" ? "desc" : "asc");
  };

  const sortProducts = (sortBy, sortOrder) => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      // Add more sorting options if needed
    });
    setFilteredProducts(sortedProducts);
    // setProducts(sortedProducts);
  };

  const handleFilterByPrice = () => {
    if ((priceRange.min === 0 || isNaN(priceRange.min)) && (priceRange.max === 0 || isNaN(priceRange.max))) {
      // If both fields are empty or zero, set filteredProducts to allProducts
      setFilteredProducts(allProducts.data);
    } else {
      // Otherwise, filter products based on the price range
      const filteredProducts = allProducts.data.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max);
      setFilteredProducts(filteredProducts);
    }
  };

  // Logic to get current products based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Logic to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteOrder = async (productId) => {
    console.log(productId);
    try {
      const response = await fetch(`api/DeleteProduct?productId=${productId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Remove the deleted order from the state
      setProducts(products.filter((product) => product.id !== productId));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
      toast({
        title: "Order Deleted Successfully",
        description: `Product ID: ${productId}`,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteMultipleOrder = async () => {
    try {
      console.log(selectedProducts[0]);
      const deleteRequests = [];
      // Loop through the selectedProducts array
      for (const product of selectedProducts) {
        // Make a DELETE request to delete each product
        // const response = await fetch(`api/DeleteProduct?productId=${product}`, {
        //   method: "DELETE",
        //   headers: {
        //     Accept: "application/json",
        //   },
        // });
        deleteRequests.push(
          fetch(`api/DeleteProduct?productId=${product}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
          })
        );

        // if (!response.ok) {
        //   throw new Error("Failed to delete one or more orders");
        // }
      }

      // Wait for all delete requests to complete
      await Promise.all(deleteRequests);

      // After successful deletion, update the list of products in both states
      const updatedProducts = products.filter((product) => !selectedProducts.includes(product));
      const updatedFilteredProducts = filteredProducts.filter((product) => !selectedProducts.includes(product));
      setProducts(updatedProducts);
      setFilteredProducts(updatedFilteredProducts);

      // Clear the selectedProducts array
      setSelectedProducts([]);
      toast({
        title: "Selected Products Deleted Successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Error deleting one or more orders:", error);
      toast({
        title: "Error Deleting Orders",
        description: "Failed to delete one or more orders",
        status: "error",
      });
    }
  };

  return (
    <div className="container flex flex-col p-10 min-h-screen max-w-full">
      <div className="mb-7 flex justify-between align-center">
        <h1 className=" text-base sm:text-lg md:text-xl lg:text-2xl xl:text-5xl">Products</h1>
        <div className="product-buttons flex align-center mt-1 gap-2">
          {selectedProducts.length > 0 && (
            <Button onClick={handleDeleteMultipleOrder} variant="destructive">
              Delete Selected
            </Button>
          )}
          <Button onClick={(e) => router.push("products/create")} variant="create">
            Create a Product
          </Button>
        </div>
      </div>
      <div className="filters mb-7 flex gap-2">
        <div className="filter-section flex border-2 border-dashed flex-1 rounded p-5">
          <label className="mr-2 pt-2 flex-0.75 ">Price Range:</label>
          <Input className="mr-2 p-2 rounded flex-1" type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) })} />
          <Input className="mr-2 p-2 rounded flex-1" type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) })} />
          <Button className="flex-1" onClick={handleFilterByPrice}>
            Apply
          </Button>
        </div>
        <div className="sort-section flex gap-4 align-center border-2 border-dashed rounded flex-1 p-5">
          <label className="pt-2">Sort By:</label>
          <Select>
            <SelectTrigger className="w-[180px]" onChange={handleSortChange}>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Price</SelectItem>
            </SelectContent>
          </Select>
          <Toggle onClick={handleSortOrderChange} variant="outline">
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Toggle>
        </div>
      </div>
      {currentProducts.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleProductSelection(product.id)} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button onClick={(e) => router.push(`products/${product.id}`)} variant="update">
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteOrder(product.id)} variant="destructive">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Toggle>
          <p>No products found</p>
        </Toggle>
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
          {indexOfLastProduct < filteredProducts.length && (
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
    const response = await fetch("https://fastapi-ecommerce-api.onrender.com/products/all?limit=100&offset=10");
    const allProducts = await response.json();

    return {
      props: { allProducts },
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    return {
      props: { allProducts: [] },
    };
  }
};

export default Products;
