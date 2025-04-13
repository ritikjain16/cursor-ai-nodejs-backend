import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate prices
    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = itemsPrice * 0.15; // 15% tax
    const totalPrice = itemsPrice;
    const totalAmount = totalPrice + shippingPrice + taxPrice;

    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      size: item.size,
      price: item.product.price,
      image: item.product.images[0]
    }));

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: itemsPrice,
      shippingPrice,
      taxPrice,
      totalAmount,
      status: 'pending'
    });

    // If payment method is Razorpay, create Razorpay order
    if (paymentMethod === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Razorpay expects amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: order._id.toString(),
        notes: {
          orderId: order._id.toString(),
          userId: req.user._id.toString()
        }
      });

      // Update order with Razorpay orderId
      order.paymentResult = {
        razorpay: {
          orderId: razorpayOrder.id
        },
        status: 'pending'
      };
      await order.save();

      // Return Razorpay order details along with the order
      return res.status(201).json({
        order,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      });
    }

    // Update product quantities
    for (const item of cart.items) {
      // Find and update product quantity atomically
      const result = await Product.findOneAndUpdate(
        { 
          _id: item.product._id,
          'sizes': {
            $elemMatch: {
              'size': item.size,
              'quantity': { $gte: item.quantity }
            }
          }
        },
        {
          $inc: {
            'sizes.$.quantity': -item.quantity
          }
        },
        { new: true }
      );

      if (!result) {
        // If update failed, either product not found or not enough quantity
        const product = await Product.findById(item.product._id);
        if (!product) {
          throw new Error(`Product ${item.product._id} not found`);
        }

        const size = product.sizes.find(s => s.size === item.size);
        if (!size) {
          throw new Error(`Size ${item.size} not found for product ${product.name}`);
        }

        throw new Error(
          `Not enough quantity available for ${product.name} in size ${item.size}. ` +
          `Requested: ${item.quantity}, Available: ${size.quantity}`
        );
      }

      console.log(`Updated quantity for product ${item.product._id}, size ${item.size}: -${item.quantity}`);
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentResult.status = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order payment details
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing'; // Update order status after successful payment
    order.paymentResult = {
      razorpay: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      },
      status: 'completed',
      update_time: new Date(),
      email_address: req.user.email
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 