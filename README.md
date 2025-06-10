# Fashion Collection API Documentation

## Base URL

```
https://your-api-domain.com/api
```

## Authentication

Some endpoints require authentication using JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Product Endpoints

### Get All Products

```http
GET /products

Response: 200 OK
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "imageUrl": "string",
    "category": "string",
    "rating": number,
    "reviews": number,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### Get Single Product

```http
GET /products/:id

Response: 200 OK
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "imageUrl": "string",
  "category": "string",
  "rating": number,
  "reviews": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Create Product (Admin only)

```http
POST /products
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": number,
  "imageUrl": "string",
  "category": "string",
  "rating": number (optional),
  "reviews": number (optional)
}

Response: 201 Created
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "imageUrl": "string",
  "category": "string",
  "rating": number,
  "reviews": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Update Product (Admin only)

```http
PUT /products/:id
Content-Type: application/json

{
  "name": "string" (optional),
  "description": "string" (optional),
  "price": number (optional),
  "imageUrl": "string" (optional),
  "category": "string" (optional),
  "rating": number (optional),
  "reviews": number (optional)
}

Response: 200 OK
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "imageUrl": "string",
  "category": "string",
  "rating": number,
  "reviews": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Delete Product (Admin only)

```http
DELETE /products/:id

Response: 200 OK
{
  "message": "Product deleted successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Error message describing the issue"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Product not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Development: 100 requests per 15 minutes
- Production: Configurable through environment variables

## Environment Variables

```env
NODE_ENV=development|production
PORT=1901
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Development

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start:prod
```

Seed the database:

```bash
npm run seed       # Development
npm run seed:prod  # Production
```
