# LowPriceMart — Full Stack E-Commerce Platform

A full-featured e-commerce application with separate user and admin frontends, powered by a Node.js/Express backend with MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend (User)** | React 19, Vite, Tailwind CSS v4, shadcn/ui, Redux Toolkit |
| **Frontend (Admin)** | React 19, Vite, Tailwind CSS v4, shadcn/ui, Redux Toolkit, Recharts |
| **Backend** | Node.js, Express 5, MongoDB (Mongoose), JWT Auth, Cloudinary, Nodemailer |
| **Validation** | Zod |

## Folder Structure

```
LowPriceMart/
├── Backend/               # Express API server
│   ├── config/            # DB, Cloudinary, email, constants
│   ├── controllers/       # Route handlers
│   ├── helpers/           # Pagination utility
│   ├── middleware/        # Auth, upload, validation
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   └── services/          # Email service
│
├── Frontend/
│   ├── user/              # Customer-facing app
│   │   ├── src/
│   │   │   ├── components/  # UI + shared components
│   │   │   ├── pages/       # Route pages
│   │   │   ├── services/    # API client
│   │   │   └── context/     # Cart, Theme providers
│   │   └── public/
│   │
│   └── admin/             # Admin dashboard app
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── pages/       # Admin pages
│       │   ├── services/    # API client
│       │   └── hooks/       # Auth slices
│       └── public/
```

## Quick Start

See individual READMEs in each subdirectory:

- [Backend README](./Backend/README.md)
- [Frontend User README](./Frontend/user/README.md)
- [Frontend Admin README](./Frontend/admin/README.md)
