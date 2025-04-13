import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  images: [{
    type: String,
    required: [true, 'Product image URL is required']
  }],
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'unisex'],
  },
  subCategory: {
    type: String,
    required: true,
    enum: ['tshirts', 'shirts', 'pants', 'dresses', 'skirts', 'jackets', 'sweaters', 'activewear', 'accessories', 'shoes']
  },
  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '6', '7', '8', '9', '10', '11', '12', 'ONE SIZE'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  color: {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true // Hex color code
    }
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  material: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  careInstructions: [{
    type: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  isNewArrival: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index for better search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product; 