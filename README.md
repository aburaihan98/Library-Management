# Library Management API

API for managing books and borrowings using Express, TypeScript & MongoDB.

---

## Features

- CRUD operations on books with validation
- Borrow books with stock check and update
- Borrowed books summary using aggregation
- Filtering, sorting, and pagination support
- Proper error handling with standardized responses

---

## API Endpoints

- **POST** `/api/books` — Create book
- **GET** `/api/books` — List books (filter, sort, limit)
- **GET** `/api/books/:bookId` — Get book by ID
- **PUT** `/api/books/:bookId` — Update book
- **DELETE** `/api/books/:bookId` — Delete book
- **POST** `/api/borrow` — Borrow a book
- **GET** `/api/borrow` — Borrowed books summary

---

## Example: Create Book

Request:

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "copies": 5,
  "available": true
}
```

````

Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    /* book data */
  }
}
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    /* error details */
  }
}
```

---

## Setup

1. Clone repo & install dependencies
2. Run server: `npm run dev`
````
