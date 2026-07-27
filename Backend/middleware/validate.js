import { z } from "zod";

const formatZodErrors = (err) => (err.issues || err.errors || []).map((e) => ({ field: e.path.join ? e.path.join(".") : e.path, message: e.message }));

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: formatZodErrors(result.error) });
  }
  req.body = result.data;
  next();
};

export const authSchemas = {
  register: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  login: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
};

export const productSchemas = {
  create: z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional().default(""),
    price: z.coerce.number().min(0, "Price must be >= 0"),
    category: z.string().min(1, "Category is required"),
    stock: z.coerce.number().int().min(0, "Stock must be >= 0").optional().default(0),
    image: z.string().optional().default(""),
  }),
  update: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be >= 0").optional(),
    category: z.string().optional(),
    stock: z.coerce.number().int().min(0, "Stock must be >= 0").optional(),
    image: z.string().optional(),
  }),
};

export const cartSchemas = {
  addItem: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
    qty: z.number().int().positive("Quantity must be a positive integer"),
  }),
  updateQty: z.object({
    qty: z.number().int().positive("Quantity must be a positive integer"),
  }),
};

export const orderSchemas = {
  create: z.object({
    shippingAddress: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
    }),
    paymentMethod: z.enum(["COD", "JazzCash", "EasyPaisa"], { message: "Payment method must be COD, JazzCash, or EasyPaisa" }),
    orderItems: z.array(z.object({
      product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
      qty: z.number().int().positive("Quantity must be a positive integer"),
    })).optional(),
    items: z.array(z.object({
      product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
      qty: z.number().int().positive("Quantity must be a positive integer"),
    })).optional(),
  }),
};
