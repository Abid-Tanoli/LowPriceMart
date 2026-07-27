# LowPriceMart — Backend API

Express 5 + MongoDB backend for the LowPriceMart e-commerce platform.

## Setup

```bash
cd Backend
npm install
```

## Environment Variables

Create a `.env` file in the `Backend/` directory (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for order emails |
| `EMAIL_PASS` | Gmail app password |

## Run

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`.

## API Routes

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/profile` | Get user profile (protected) |

### Products (`/api/products`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List products (paginated, filterable) |
| GET | `/:id` | Get single product |

### Cart (`/api/cart`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get user cart (protected) |
| POST | `/add` | Add item to cart (protected) |
| PUT | `/:productId` | Update item quantity (protected) |
| DELETE | `/:productId` | Remove item (protected) |
| DELETE | `/remove/:id` | Clear cart (protected) |

### Orders (`/api/orders`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create order (protected) |
| GET | `/myorders` | Get user orders (protected) |
| GET | `/:id` | Get order by ID (protected, owner or admin) |

### Admin (`/api/admin`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard-stats` | Dashboard stats (admin) |
| GET | `/users` | List all users (admin) |
| GET | `/orders` | List all orders (admin) |
| GET | `/products` | List all products (admin) |
| GET | `/products/paginated` | Paginated products (admin) |
| GET | `/product/:id` | Get product (admin) |
| POST | `/product` | Create product (admin, multipart) |
| PUT | `/product/:id` | Update product (admin, multipart) |
| DELETE | `/product/:id` | Delete product (admin) |
