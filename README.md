# Theobroma Patisserie - Modern Frontend Project

A modern, responsive, and artisanal frontend recreation inspired by [Theobroma](https://theobroma.in/) (*Food of the Gods*), crafted with an elegant and refined warm color palette.

---

## 🎨 Color Palette Enhancements

The original Theobroma color scheme uses pastel apricot peach (`#F9BDB6`) and rich cocoa (`#513E35`). In this project, we refined the palette for higher accessibility, contrast, and modern luxury aesthetics:

| Role | Color | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | Warm Rose Terracotta | `#C96A5B` | Primary buttons, badges, highlights & logo subtext |
| **Primary Dark / Hover** | Deep Rose Terracotta | `#B5584A` | Hover & focus states |
| **Primary Light / Tint** | Peach Blush | `#FCEEE8` | Background pills, tags, cart count background |
| **Deep Neutral** | Rich Espresso Chocolate | `#2C1E1A` | Primary typography, headers, footer background |
| **Warm Biscuit Background** | Soft Bakery Cream | `#FDF8F5` | Main body background |
| **Golden Pastry Accent** | Warm Amber Glow | `#D49B43` | Star ratings, badges, and accents |
| **Vegetarian Badge** | Authentic Emerald Green | `#0E8044` | Indian veg/eggless marker |

---

## ✨ Features Included

1. **Top Announcement Bar**:
   - Welcome discount coupon code (`THEO15`)
   - Direct store locator & track order links

2. **Smart Header & Navigation**:
   - Sticky header with glassmorphism backdrop blur
   - Responsive mobile drawer navigation
   - Delivering-to City Selector (Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, Kolkata)
   - Live Search trigger
   - Real-time Shopping Bag icon with dynamic item count badge

3. **Hero Showcase**:
   - High-impact culinary imagery
   - Signature perks (60-min delivery, 100% eggless options, authentic Belgian cocoa)
   - Floating social proof badge ("10M+ Slices Sold")

4. **Brand Value Pillars (USPs)**:
   - Pure Ingredients (No shortcuts, real butter)
   - Baked Fresh Daily
   - Same-Day Doorstep Delivery
   - Honestly Priced

5. **Interactive Category Filtering**:
   - Horizontal category pills: *All Items, Brownies, Cakes & Cheesecakes, Pastries & Tarts, Tea Cakes & Breads, Savouries, Hampers & Gifting*
   - Interactive Eggless / Vegetarian-only toggle switch
   - Sort dropdown (Featured, Price Low to High, Price High to Low, Top Rated)

6. **Interactive Slide-Out Shopping Bag**:
   - Dynamic slide-out drawer
   - Real-time quantity increment/decrement (`+` / `-`)
   - Free delivery progress bar (calculates remaining amount until ₹500 threshold)
   - Automatic subtotal, GST (5%), and conditional delivery fee calculation
   - LocalStorage persistence (cart items persist across page refreshes)

7. **Speciality Celebration Cakes & Hampers**:
   - Highlight section for milestone celebration cakes
   - Curated festive and corporate gifting section with direct add-to-bag actions

8. **Brand Heritage Story & Customer Testimonials**:
   - Tribute to Theobroma's Colaba roots and Parsi culinary traditions
   - Genuine 5-star customer reviews

---

## 🚀 Running the Project

You can open the project directly in any browser:

```bash
# Option 1: Open index.html directly
open /Users/rashichauhan/.gemini/antigravity/scratch/theobroma-frontend/index.html

# Option 2: Run a lightweight local HTTP server
cd /Users/rashichauhan/.gemini/antigravity/scratch/theobroma-frontend
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.
