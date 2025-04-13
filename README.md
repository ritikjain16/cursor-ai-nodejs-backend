# E-commerce Backend

A Node.js backend application built with Express and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Make sure MongoDB is installed and running locally)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecom_db
   NODE_ENV=development
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Project Structure

```
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/        # Database models
├── routes/        # API routes
├── middleware/    # Custom middleware
├── utils/         # Utility functions
├── .env           # Environment variables
├── server.js      # Entry point
└── README.md      # Project documentation
``` 