require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const Gift = require("./models/Gift");
const City = require("./models/City");

const products = [
  { id: "p1", name: "The Chocolate Overload Brownie", category: "brownies", tag: "Bestseller", price: 130, eggless: true, rating: 4.9, reviews: 1420, portion: "1 pc (100g)", desc: "Our iconic dense, fudgy chocolate brownie loaded with Belgian dark chocolate chips. Truly legendary.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p2", name: "Classic Walnut Brownie", category: "brownies", tag: "Original Recipe", price: 125, eggless: false, rating: 4.8, reviews: 890, portion: "1 pc (95g)", desc: "Rich dark cocoa base studded generously with toasted Kashmiri walnuts for the perfect crunch.", image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p3", name: "Dutch Truffle Celebration Cake", category: "cakes", tag: "Must Try", price: 750, eggless: true, rating: 4.9, reviews: 2100, portion: "500g (Serves 4-6)", desc: "Decadent dark chocolate sponge layered with smooth chocolate ganache made from 54% dark cocoa.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p4", name: "New York Style Baked Cheesecake", category: "cakes", tag: "Chef's Special", price: 950, eggless: false, rating: 4.9, reviews: 940, portion: "600g (Serves 4-6)", desc: "Velvety smooth cream cheese baked over a crisp golden biscuit base. Classic authentic NY recipe.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p5", name: "Fresh Strawberry Tart / Pastry", category: "pastries", tag: "Seasonal", price: 165, eggless: true, rating: 4.7, reviews: 430, portion: "1 pc (110g)", desc: "Crisp butter shortcrust shell filled with vanilla pastry cream and topped with fresh fruit glaze.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p6", name: "Red Velvet Pastry Slice", category: "pastries", tag: "Popular", price: 145, eggless: true, rating: 4.8, reviews: 1120, portion: "1 pc (120g)", desc: "Vibrant crimson cocoa sponge layered with our signature tangy-sweet Philadelphia cream cheese frosting.", image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p7", name: "Mawa Tea Cake Loaf", category: "teacakes", tag: "Parsi Classic", price: 290, eggless: false, rating: 4.8, reviews: 670, portion: "350g Loaf", desc: "Our beloved traditional Parsi tea cake enriched with caramelized mawa, cardamom, and almond flakes.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p8", name: "Pure Butter Croissant", category: "savouries", tag: "Artisanal", price: 110, eggless: false, rating: 4.7, reviews: 510, portion: "1 pc (80g)", desc: "Flaky, multi-layered golden French pastry crafted with premium slow-churned butter.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p9", name: "Paneer Tikka Roll / Puff", category: "savouries", tag: "Warm Savoury", price: 120, eggless: true, rating: 4.6, reviews: 380, portion: "1 pc (130g)", desc: "Spiced chargrilled cottage cheese wrapped in delicate, crisp puff pastry. Served warm.", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: "p10", name: "Assorted Brownie Celebration Box (Pack of 6)", category: "gifting", tag: "Gift Ready", price: 650, eggless: true, rating: 5.0, reviews: 1820, portion: "6 Assorted Brownies", desc: "A curated gift box containing Walnut, Overload, Cookie-Dough, and Nutella brownies in elegant packaging.", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80", isActive: true },
];

const gifts = [
  { id: "g1", name: "Assorted Brownie Celebration Box", price: 650, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80", desc: "A festive selection of assorted signature brownies, ready to gift.", category: "gifting", tag: "Gift Ready", eggless: true, rating: 5, reviews: 1820, portion: "Pack of 6", isActive: true },
  { id: "g2", name: "Artisanal Tea-Time Hamper", price: 1250, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", desc: "An elegant hamper for thoughtful tea-time gifting.", category: "gifting", tag: "Curated Hamper", eggless: true, rating: 4.8, reviews: 350, portion: "Gift hamper", isActive: true },
  { id: "g3", name: "The Royal Grand Patisserie Box", price: 2100, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80", desc: "A premium assortment curated for special celebrations.", category: "gifting", tag: "Premium Gift", eggless: true, rating: 4.9, reviews: 240, portion: "Grand gift box", isActive: true },
];

const cities = [
  { id: "c1", name: "Mumbai, Bandra West", city: "Mumbai", shortName: "Bandra West", icon: "📍", outlets: "Mumbai delivery", isActive: true },
];

async function upsertById(Model, documents) {
  if (!documents.length) return;
  const operations = documents.map((document) => ({
    updateOne: {
      filter: { id: document.id },
      update: { $set: document },
      upsert: true,
    },
  }));
  await Model.bulkWrite(operations);
}

async function seed() {
  try {
    await connectDB();
    await upsertById(Product, products);
    await upsertById(Gift, gifts);
    await upsertById(City, cities);
    console.log(`Seed complete: ${products.length} products, ${gifts.length} gifts, ${cities.length} city.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close().catch(() => {});
  }
}

seed();
