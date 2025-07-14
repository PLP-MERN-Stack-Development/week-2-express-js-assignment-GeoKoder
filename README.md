# 🚂 Week 2: Express.js – Server-Side Framework

## 🚀 Objective

Build a **RESTful API** using **Express.js** that supports standard CRUD operations, proper routing, middleware implementation, error handling, and advanced API features like search, filtering, pagination, and statistics.

## 📦 Project Overview

This Express.js server manages a collection of **products** using in-memory storage. It includes:

- 🔁 Full CRUD operations
- 🔐 API Key Authentication
- 🧱 Middleware (logging, validation, error handling)
- 🕵️ Filtering, searching, and pagination
- 📊 Product statistics by category

## 🛠️ Setup Instructions

### 1. Prerequisites

- **Node.js** (v18 or higher recommended)
- A terminal tool (e.g., VS Code Terminal, Git Bash, or CMD)

Verify your Node version:

```bash
node -v
````

### 2. Installation Steps

1. **Clone the repository** (or create a new project and use the provided `server.js`):
```bash
git clone https://github.com/your-username/express-products-api.git
cd express-products-api
```

2. **Install dependencies:**

```bash
npm install express body-parser uuid
```

3. **Run the server:**

```bash
node server.js
Server will start at:
```

http://localhost:3000


## 📁 API Endpoints
### 🌐 Root

| Method | Route | Description           |
| ------ | ----- | --------------------- |
| GET    | `/`   | Returns "Hello World" |

### 📦 Products CRUD

| Method | Route               | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/api/products`     | List all products          |
| GET    | `/api/products/:id` | Get product by ID          |
| POST   | `/api/products`     | Create a new product       |
| PUT    | `/api/products/:id` | Update an existing product |
| DELETE | `/api/products/:id` | Delete a product           |

### 🔍 Advanced Features

| Feature    | Route                           | Description                            |
| ---------- | ------------------------------- | -------------------------------------- |
| Filter     | `/api/products?category=...`    | Filter products by category            |
| Pagination | `/api/products?page=1&limit=2`  | Paginate the product list              |
| Search     | `/api/products/search?name=...` | Search products by name                |
| Stats      | `/api/products/stats`           | Returns count of products per category |

## 🔒 Authentication (API Key)

Optional middleware (can be enabled in `server.js`) that checks for a valid API key in headers:

**Header to include in requests:**

x-api-key: 12345SECRETKEY
```
Uncomment this line in `server.js` to activate:
```js
// app.use(apiKeyAuth);
```

## 🧱 Middleware Breakdown

### ✅ Custom Logger

Logs every request with method, URL, and timestamp:
```
[2024-07-13T12:00:00Z] GET /api/products
```
### ✅ JSON Parser
Parses incoming JSON requests using `body-parser` and `express.json()`.

### ✅ Product Validation

Ensures:
* `name` is a non-empty string
* `price` is a positive number
* `inStock` is a boolean (if provided)

### ✅ Error Handling

Global error handler for:
* 404 not found routes
* Asynchronous and synchronous errors
* Custom error classes:
  * `NotFoundError`
  * `ValidationError`
  * `UnauthorizedError`


## 🧪 Testing the API

### ✅ Tools You Can Use

* Postman / Insomnia
* Curl
* VS Code REST Client extension

### 📬 Example Request: Create Product

```http
POST /api/products
Content-Type: application/json
x-api-key: 12345SECRETKEY

{
  "name": "Headphones",
  "description": "Wireless over-ear headphones",
  "price": 199.99,
  "category": "electronics",
  "inStock": true
}
```

### 📬 Example Request: Search by Name

```http
GET /api/products/search?name=laptop
```

### 📬 Example Request: Get Stats

```http
GET /api/products/stats
```

Response:

```json
{
  "countsByCategory": {
    "electronics": 2,
    "kitchen": 1
  },
  "totalProducts": 3
}
```

---

## 🚧 Future Improvements

* Use a real database (MongoDB, PostgreSQL)
* Add user authentication and authorization
* Add sorting by price/name
* Add Swagger documentation
* Dockerize the app for deployment

---

## 📄 License

This project is free to use for educational purposes.

---

## 🙌 Acknowledgments

This project was created as part of a backend learning journey in Express.js (Week 2). Special thanks to mentors and peers for their input!

---

> ✅ Tip: You can edit and improve this README as your project grows. Good documentation makes your code more valuable!

