# Baby Shop

A full-stack e-commerce platform for baby and parenting essentials, built as a monorepo with a customer storefront, admin dashboard, and REST API backend.

The project brings together a modern shopping experience for customers with a complete management layer for catalog, orders, users, analytics, and promotions.

## Overview

Baby Shop is designed to support a complete retail workflow:

- Customer-facing storefront with product browsing, category navigation, cart, checkout, and order tracking
- Admin dashboard for managing products, categories, brands, banners, users, and orders
- Secure authentication and authorization for customers and administrators
- Stripe-powered checkout and payment flow
- Media uploads via Cloudinary
- REST API documentation with Swagger
- MongoDB-based data persistence

## Tech Stack

### Frontend (Customer App)
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Stripe.js
- Zustand for state management

### Admin Panel
- Vite
- React 19
- TypeScript
- Tailwind CSS
- Recharts for analytics
- React Hook Form + Zod for validation

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- Stripe Payments
- Cloudinary
- Swagger UI

## Project Structure

```text
baby-shop/
├── client/        # Customer storefront (Next.js)
├── admin/         # Admin dashboard (Vite + React)
├── server/        # API and business logic (Express + MongoDB)
├── README.md      # Project overview and setup guide
└── .gitignore
```

## Features

### Customer Experience
- Responsive storefront for baby products and lifestyle essentials
- Product listing and filtering by brand and category
- Product detail pages with pricing and media content
- Shopping cart and checkout flow
- Order history and account profile management
- Secure authentication and account creation
- Stripe checkout integration

### Admin Experience
- Dashboard with business metrics and analytics
- Product management (create, update, delete, publish state)
- Brand and category management
- Banner and promotional content management
- User management and access control
- Order processing and fulfillment tracking
- Invoice generation and export support

### Backend Capabilities
- User registration and login APIs
- Product, category, and brand endpoints
- Cart and checkout orchestration
- Analytics and stats endpoints
- Upload service for assets
- Secure CORS and cookie-based session flow

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm 9+
- MongoDB instance or MongoDB Atlas connection
- Stripe account for payment testing
- Cloudinary account for media uploads

## Installation

Clone the repository:

```bash
git clone https://github.com/ahmedmostafaa0/baby-shop.git
cd baby-shop
```

Install dependencies for each app separately:

```bash
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

## Environment Variables

Create `.env` files in each project folder based on the required configuration.

### Server (`server/.env`)

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_URL=http://localhost:5173
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Client (`client/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_ENV=development
```

### Admin (`admin/.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_CLIENT_URL=http://localhost:5173
VITE_APP_ENV=development
```

> Note: Keep all secrets out of version control and use a local `.env` file or a secure deployment secret manager in production.

## Running the Project

Start the backend API:

```bash
cd server
npm run dev
```

Start the customer storefront:

```bash
cd client
npm run dev
```

Start the admin dashboard:

```bash
cd admin
npm run dev
```

Then open the apps in your browser:

- Customer app: http://localhost:3000
- Admin app: http://localhost:5173
- API docs: http://localhost:8000/api/docs

## Scripts

### Server
```bash
npm run dev     # Start Express API in development mode
npm run build   # Compile TypeScript to JavaScript
npm run swagger # Generate Swagger documentation
```

### Client
```bash
npm run dev     # Start the Next.js storefront
npm run build   # Build production bundle
npm run start   # Run production build
npm run lint    # Lint the project
```

### Admin
```bash
npm run dev     # Start Vite dev server
npm run build   # Create production build
npm run preview # Preview the production build
npm run lint    # Lint the codebase
```

## API Documentation

Swagger is available for the backend API at:

```text
http://localhost:8000/api/docs
```

This documentation includes the available endpoints for auth, users, products, categories, brands, orders, analytics, and upload services.

## Production Notes

For production deployment, consider:

- Using a managed MongoDB cluster
- Setting secure environment variables in your host platform
- Configuring Stripe webhooks for payment confirmation
- Enabling Cloudinary for media optimization and storage
- Serving the client and admin app through a production build pipeline

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear summary

## License

This project is currently distributed under the project’s default repository license. Please review the license file before production use or redistribution.

## Contact

For questions, collaboration, or support, please reach out to the project maintainer through the repository owner or issue tracker.
