// pages/api/CreateOrder.js

// Import necessary modules
import Cors from "cors";
import initMiddleware from "@/lib/init-middleware";

// Initialize the CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ["POST"],
  })
);

// Define the handler function for the API route
export default async function handler(req, res) {
  // Use the CORS middleware
  await cors(req, res);

  // Check if the request method is POST
  if (req.method === "POST") {
    try {
      // Fetch the order data from the request body
      const { items, userAddress } = req.body;

      // Make the POST request to create the order
      const response = await fetch("https://fastapi-ecommerce-api.onrender.com/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, userAddress }),
      });

      // Check if the request was successful
      if (!response.ok) {
        // If not, throw an error
        throw new Error("Failed to create order");
      }

      // Extract the response data
      const data = await response.json();

      // Send a success response with the created order data
      res.status(200).json(data);
    } catch (error) {
      // Handle errors and send an error response
      res.status(500).json({ error: error.message });
    }
  } else {
    // If the request method is not POST, send a 405 Method Not Allowed response
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
