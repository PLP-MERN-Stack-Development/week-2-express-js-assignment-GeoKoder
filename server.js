// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const VALID_API_KEY = "12345SECRETKEY";

// Custom error classes
class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NotFoundError extends BaseError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ValidationError extends BaseError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

//Custom middleware
function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);

  next();
}

function apiKeyAuth(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return next(new UnauthorizedError("API key missing"));
  }

  if (apiKey !== VALID_API_KEY) {
    return next(new UnauthorizedError("Invalid API key"));
  }

  next();
}

function validateProduct(req, res, next) {
  const { name, price, inStock } = req.body;

  if (!name || typeof name !== "string") {
    return next(
      new ValidationError("Product name is required and must be a string.")
    );
  }
  if (price === undefined || typeof price !== "number" || price <= 0) {
    return next(
      new ValidationError(
        "Price is required and must be a number greater than 0."
      )
    );
  }
  if (inStock !== undefined && typeof inStock !== "boolean") {
    return next(new ValidationError("inStock must be a boolean if provided."));
  }

  next();
}

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Middleware setup
app.use(bodyParser.json());
app.use(logger);
app.use(express.json());
// app.use(apiKeyAuth);

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  const { category } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  let filteredProducts = products;
  if (category) {
    filteredProducts = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    totalItems,
    totalPages,
    products: paginatedProducts,
  });
});

// Get request to implement searching
app.get("/api/products/search", (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Query parameter 'name' is required. " });
  }

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(results);
});

// Get Route to implement product statistics
app.get("/api/products/stats", (req, res) => {
  const countsByCategory = {};

  products.forEach((product) => {
    const category = product.category;
    if (countsByCategory[category]) {
      countsByCategory[category]++;
    } else {
      countsByCategory[category] = 1;
    }
  });

  res.json({
    countsByCategory,
    totalProducts: products.length,
  });
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Some sample routes that throw errors for testing purposes.
app.get("/error-sync", (req, res) => {
  // This throws an error automatically
  throw new Error("Synchronous error occurred!");
});

app.get("/error-async", (req, res, next) => {
  // Simulate an async error
  setTimeout(() => {
    next(new Error("Asynchronous error occurred!"));
  }, 100);
});

// POST /api/products - Create a new product
app.post(
  "/api/products",
  validateProduct,
  asyncHandler(async (req, res) => {
    try {
      const newProduct = {
        id: uuidv4(),
        ...req.body,
        inStock: req.body.inStock || false,
      };

      products.push(newProduct);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  })
);

// PUT /api/products/:id - Update a product
app.put("/api/products/:id", validateProduct, (req, res) => {
  try {
    const id = req.params.id;
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    products[index] = { ...products[index], ...req.body, id };
    res.status(200).json(products[index]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    const initialLength = products.length;
    products = products.filter((product) => product.id !== id);
    if (products.length === initialLength) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling
// Optional 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

//Global error handling
app.use((err, req, res, next) => {
  console.error("Error handler:", err.stack);

  const status = err.statusCode || 500;

  res.status(status).json({
    error: err.name || "Error",
    message: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
