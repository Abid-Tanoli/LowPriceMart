# LowPriceMart — User Frontend

Customer-facing e-commerce app built with React 19 + Vite + shadcn/ui.

## Setup

```bash
cd Frontend/user
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

- Product browsing with category/price filters and search
- Product details with image gallery and quantity selector
- Shopping cart with quantity management
- Multi-step checkout (shipping → payment → review)
- Order history and order details
- User profile management
- Dark mode support
- Responsive mobile-first design
