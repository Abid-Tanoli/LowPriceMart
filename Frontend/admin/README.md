# LowPriceMart — Admin Dashboard

Admin panel for managing products, orders, and users. Built with React 19 + Vite + shadcn/ui.

## Setup

```bash
cd Frontend/admin
npm install
```

## Environment Variables

Create a `.env` file (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

## Run

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Features

- Dashboard with stats (users, orders, products)
- Product CRUD with image upload and edit dialog
- Order management with payment/delivery status
- User list with role badges
- Responsive sidebar layout
- Dark mode support
