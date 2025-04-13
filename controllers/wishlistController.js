import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Populate wishlist with product details
    const populatedUser = await User.findById(user._id)
      .populate('wishlist', 'name images price isOnSale salePrice');

    res.json(populatedUser.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );
    await user.save();

    // Populate wishlist with product details
    const populatedUser = await User.findById(user._id)
      .populate('wishlist', 'name images price isOnSale salePrice');

    res.json(populatedUser.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name images price isOnSale salePrice description category subCategory brand');

    res.json(user.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
export const checkWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    const isInWishlist = user.wishlist.includes(productId);
    res.json({ isInWishlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 