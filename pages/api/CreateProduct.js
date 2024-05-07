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
      // Fetch the product data from the request body
      const { name, price, quantity } = req.body;

      // Make the POST request to create the product
      const response = await fetch(`https://fastapi-ecommerce-api.onrender.com/products/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, quantity }),
      });

      // Check if the request was successful
      if (!response.ok) {
        // If not, throw an error
        throw new Error("Failed to create product");
      }

      // Extract the response data
      const data = await response.json();

      // Send a success response with the created product data
      res.status(201).json(data);
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
