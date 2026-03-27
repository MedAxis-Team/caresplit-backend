# CareSplit Backend API

Backend service for the CareSplit application, built with Node.js, Express, TypeScript, and MongoDB.

This API provides:
- User authentication (signup and login)
- Bill upload and retrieval
- Payment initialization and verification with Interswitch

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Run Commands](#run-commands)
7. [API Overview](#api-overview)
8. [Authentication](#authentication)
9. [API Endpoints](#api-endpoints)
10. [Response Pattern](#response-pattern)
11. [Known Gaps and Notes](#known-gaps-and-notes)
12. [License](#license)

## Overview

Base API path:

```
/api
```

Health check endpoint:

```
GET /
```

Sample response:

```json
{
	"message": "CareSplit API is running"
}
```

## Tech Stack

- Node.js
- Express 4
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- axios
- dotenv

## Project Structure

```
src/
	app.ts                      # Express app setup, middleware, root route, 404 handler
	index.ts                    # Application bootstrap and DB connection startup
	config/
		db.ts                     # MongoDB connection logic
	controllers/
		auth.ts                   # Auth request handlers
		bill.ts                   # Bill request handlers
		interswitch.ts            # Interswitch payment handlers
	middleware/
		authorization.ts          # Bearer token validation middleware
	models/
		auth.ts                   # User schema
		bill.ts                   # Bill schema
		payment.ts                # Payment schema
	routes/
		auth.ts                   # /api/auth routes
		bill.ts                   # /api/bill routes
		interswitch.ts            # /api/pay routes
		index.ts                  # Route aggregator
	services/
		auth.ts                   # Auth business logic
		bill.ts                   # Bill business logic
	types/
		express.d.ts              # Express Request user typing
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create a `.env` file in the project root and add the variables listed in the Environment Variables section.

### 3. Run in development mode

```bash
npm run dev
```

Default port is `3000` unless `PORT` is set.

## Environment Variables

Use this as a starter template for `.env`:

```env
PORT=3000

# Database
MONGO_URL=mongodb://127.0.0.1:27017/caresplit
# Optional alternative key used by the code if MONGO_URL is not provided
MONGO_URI=

# JWT secrets
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret

# Interswitch config
INTERSWITCH_PRODUCT_ID=
INTERSWITCH_PAY_ITEM_ID=
INTERSWITCH_REDIRECT_URL=
INTERSWITCH_SECRET_KEY=
INTERSWITCH_MERCHANT_CODE=
```

## Run Commands

- `npm run dev`: Start development server with file watching
- `npm run build`: Compile TypeScript to `dist`
- `npm start`: Run compiled production server
- `npm run lint`: Run ESLint on source files
- `npm test`: Run tests (Jest script exists)

## API Overview

Route groups:
- `/api/auth`
- `/api/bill`
- `/api/pay`

## Authentication

Protected routes use Bearer token authentication.

Header format:

```http
Authorization: Bearer <access_token>
```

Access token is returned by login endpoint.

## API Endpoints

### Auth

1. `POST /api/auth/signup`

Request body:

```json
{
	"fullname": "John Doe",
	"email": "john@example.com",
	"phone": "08012345678",
	"password": "strong-password"
}
```

2. `POST /api/auth/login`

Request body:

```json
{
	"email": "john@example.com",
	"password": "strong-password"
}
```

Success response includes:
- `user`
- `token` (access token, 1 hour)
- `refreshToken` (7 days)

### Bills

1. `POST /api/bill/bill` (Protected)

Request body:

```json
{
	"totalAmount": 25000,
	"hospitalName": "City Hospital",
	"treatmentBreakdown": [
		{ "name": "Consultation", "cost": 5000 },
		{ "name": "Lab Test", "cost": 20000 }
	],
	"hospitalAddress": "12 Health Street, Lagos",
	"dateOfService": "2026-03-20T00:00:00.000Z"
}
```

2. `GET /api/bill/getBills`

Returns all bills.

3. `GET /api/bill/getBill/:billId`

Returns a single bill by ID.

### Payments (Interswitch)

1. `POST /api/pay/pay/:billId` (Protected)

Initializes payment and returns payment payload:
- `merchantCode`
- `payItemId`
- `amount`
- `reference`
- `hash`
- `mode`

2. `GET /api/pay/verify/:paymentId`

Triggers verification against Interswitch.

## Response Pattern

Most endpoints return a JSON object in this style:

```json
{
	"status": "success",
	"message": "Description",
	"data": {}
}
```

Error example:

```json
{
	"status": "error",
	"message": "Error message"
}
```

## Known Gaps and Notes

1. Payment verification route/controller parameter mismatch:
- Route uses `:paymentId`
- Controller reads `req.params.reference`

2. Status enum mismatch:
- `Payment` model enum is `pending | completed | failed`
- Verification controller writes `success`
- `Bill` model enum is `pending | approved | rejected`
- Verification controller writes `paid`

3. Some endpoints currently return HTTP 500 for validation/auth/business errors that may be better represented as 400/401/404.

4. `cookie-parser` is installed but not used in current middleware pipeline.

## License

MIT
