# 👕 T-Shirt E-Commerce Store (Next.js + Stripe + Printful)

A full-stack, print-on-demand T-shirt store using **Next.js**, **Stripe**, and **Printful**.  
This store allows users to browse T-shirts, place orders with Stripe, and automatically fulfill them via Printful's API.

---

## 🧱 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: PostgreSQL (with Prisma ORM)
- **Payments**: Stripe Checkout
- **Authentication**: NextAuth.js (Email + OAuth)
- **POD Fulfillment**: Printful API integration
- **Image Hosting**: Cloudinary
- **Deployment**: Vercel

---

## 🔧 Core Features

### 🛒 Customer Storefront

- Home page with featured products
- Shop page with T-shirt listing
- Product detail page (select size, add to cart)
- Shopping cart (managed via Zustand)
- Checkout page (Stripe Checkout session)
- Order confirmation page

### 🧾 Orders + Fulfillment

- Orders stored in PostgreSQL
- Orders sent to **Printful API** after payment
- Receive **webhooks** from Printful to track order status
- Store and show **tracking info** to customers

### 🔐 User Auth

- Register, login, logout with NextAuth.js
- Authenticated users can view their order history

### 🛠️ Admin Panel (Optional)

- Admin login (protected route)
- CRUD operations for products
- View all customer orders

---
