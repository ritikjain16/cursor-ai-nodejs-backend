import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables
dotenv.config({ path: join(__dirname, '../.env') });

const products = [
  {
    name: "Men's Classic Fit Dress Shirt",
    description: "Elegant dress shirt perfect for formal occasions. Features a comfortable fit and wrinkle-resistant fabric.",
    price: 49.99,
    images: [
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg",
      "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg"
    ],
    category: "men",
    subCategory: "shirts",
    sizes: [
      { size: "S", quantity: 30 },
      { size: "M", quantity: 50 },
      { size: "L", quantity: 50 },
      { size: "XL", quantity: 30 }
    ],
    color: { name: "White", code: "#FFFFFF" },
    brand: "ElegantWear",
    material: "Cotton Blend",
    features: ["Wrinkle-resistant", "Regular fit", "Button-down collar"],
    careInstructions: ["Machine wash cold", "Iron on low heat"],
    tags: ["formal", "business", "men", "shirt"]
  },
  {
    name: "Women's Summer Floral Dress",
    description: "Light and breezy floral dress perfect for summer. Features a flattering A-line silhouette and comfortable fabric.",
    price: 59.99,
    images: [
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg",
      "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg"
    ],
    category: "women",
    subCategory: "dresses",
    sizes: [
      { size: "XS", quantity: 25 },
      { size: "S", quantity: 40 },
      { size: "M", quantity: 50 },
      { size: "L", quantity: 35 }
    ],
    color: { name: "Floral Blue", code: "#4169E1" },
    brand: "SummerChic",
    material: "Rayon",
    features: ["Floral print", "A-line cut", "Short sleeves"],
    careInstructions: ["Hand wash cold", "Line dry"],
    tags: ["summer", "casual", "women", "dress", "floral"]
  },
  {
    name: "Men's Slim Fit Jeans",
    description: "Modern slim fit jeans with stretch comfort. Perfect blend of style and comfort for everyday wear. Available in waist sizes 30-36 inches with 32-inch inseam.",
    price: 69.99,
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg",
      "https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg"
    ],
    category: "men",
    subCategory: "pants",
    sizes: [
      { size: "S", quantity: 35 },  // 30-31 waist
      { size: "M", quantity: 60 },  // 32-33 waist
      { size: "L", quantity: 60 },  // 34-35 waist
      { size: "XL", quantity: 35 }  // 36-38 waist
    ],
    color: { name: "Dark Blue", code: "#00008B" },
    brand: "DenimCo",
    material: "98% Cotton, 2% Elastane",
    features: ["Stretch denim", "Slim fit", "Five-pocket style"],
    careInstructions: ["Machine wash cold", "Tumble dry medium"],
    tags: ["casual", "men", "jeans", "denim"]
  },
  {
    name: "Women's Running Shoes",
    description: "Lightweight and comfortable running shoes with superior cushioning and support.",
    price: 89.99,
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
    ],
    category: "women",
    subCategory: "shoes",
    sizes: [
      { size: "6", quantity: 20 },
      { size: "7", quantity: 30 },
      { size: "8", quantity: 30 },
      { size: "9", quantity: 20 }
    ],
    color: { name: "Pink", code: "#FFB6C1" },
    brand: "SportFlex",
    material: "Mesh and Synthetic",
    features: ["Breathable mesh", "Memory foam insole", "Non-slip sole"],
    careInstructions: ["Wipe clean with damp cloth"],
    tags: ["sports", "running", "women", "shoes", "athletic"]
  },
  {
    name: "Men's Casual T-Shirt",
    description: "Comfortable cotton t-shirt perfect for casual wear. Features a classic fit and soft fabric.",
    price: 24.99,
    images: [
      "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg",
      "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg"
    ],
    category: "men",
    subCategory: "tshirts",
    sizes: [
      { size: "S", quantity: 40 },
      { size: "M", quantity: 60 },
      { size: "L", quantity: 60 },
      { size: "XL", quantity: 40 }
    ],
    color: { name: "Navy", code: "#000080" },
    brand: "CasualComfort",
    material: "100% Cotton",
    features: ["Crew neck", "Short sleeves", "Regular fit"],
    careInstructions: ["Machine wash cold", "Tumble dry low"],
    tags: ["casual", "men", "t-shirt", "basic"]
  },
  {
    name: "Women's Leather Handbag",
    description: "Elegant leather handbag with multiple compartments. Perfect for both casual and formal occasions.",
    price: 129.99,
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
      "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg"
    ],
    category: "women",
    subCategory: "accessories",
    sizes: [
      { size: "ONE SIZE", quantity: 50 }
    ],
    color: { name: "Brown", code: "#8B4513" },
    brand: "LuxuryStyle",
    material: "Genuine Leather",
    features: ["Multiple compartments", "Adjustable strap", "Gold-tone hardware"],
    careInstructions: ["Clean with leather cleaner", "Store in dust bag"],
    tags: ["accessories", "women", "handbag", "leather"]
  }
];

const seedProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Added ${createdProducts.length} products successfully`);
    console.log('Sample product:', createdProducts[0]);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts(); 