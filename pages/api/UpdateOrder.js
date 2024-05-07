// Import necessary modules
import Cors from "cors";
import initMiddleware from "@/lib/init-middleware";

// Initialize the CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ["PUT"],
  })
);

// Define the handler function for the API route
export default async function handler(req, res) {
  // Use the CORS middleware
  await cors(req, res);

  // Extract the order ID from the request query
  const { orderId } = req.query;

  // Check if the request method is PUT
  if (req.method === "PUT") {
    try {
      // Fetch the order data from the request body
      const { items, userAddress } = req.body;

      // Make the PUT request to update the order
      const response = await fetch(`https://fastapi-ecommerce-api.onrender.com/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, userAddress }),
      });

      // Check if the request was successful
      if (!response.ok) {
        // If not, throw an error
        throw new Error("Failed to update order");
      }

      // Extract the response data
      const data = await response.json();

      // Send a success response with the updated order data
      res.status(200).json(data);
    } catch (error) {
      // Handle errors and send an error response
      res.status(500).json({ error: error.message });
    }
  } else {
    // If the request method is not PUT, send a 405 Method Not Allowed response
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
