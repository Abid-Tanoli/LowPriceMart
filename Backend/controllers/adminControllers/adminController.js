import User from '../../models/userModels/User';
import Order from '../../models/userModels/Order';
import Product from '../../models/userModels/Product';

export const getAllUsers = async () => {
  const users = await User.find({});
  res.json(users);
};

export const getAllOrders = async () => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
};

export const deleteProduct = async () => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.remove();
  res.json({ message: 'Product removed' });
};
