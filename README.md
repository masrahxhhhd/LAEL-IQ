<div align="center">

# 🖥️ LAEL IQ

### From Iraq To The World

متجر تقني عراقي متخصص بأجهزة الكمبيوتر واللابتوبات والإكسسوارات والحلول التقنية

An Iraqi tech e-commerce store specializing in computers, laptops, accessories, and technology solutions.

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## ✨ Features

### 🛒 Store
- **Product Catalog** — Browse laptops, PCs, GPUs, monitors, accessories, and networking gear
- **Category Filtering** — Filter products by category
- **Search with Autocomplete** — Real-time product search with smart suggestions
- **Shopping Cart** — Add, remove, and manage items
- **Favorites / Wishlist** — Save products for later
- **Checkout Flow** — Complete purchase workflow with payment integration ready
- **Order Tracking** — View order history and status

### 👤 Authentication
- **User Registration & Login** — Full auth system with localStorage
- **Profile Management** — Upload profile picture, manage account details
- **Admin Detection** — Automatic admin panel access for authorized emails

### 🔧 Admin Dashboard
- **Dashboard Overview** — Sales stats and quick metrics
- **Product Management** — Add, edit, and manage products
- **Category Management** — Organize product categories
- **Order Management** — Track and update order statuses
- **Customer Management** — View registered customers
- **Offers & Promotions** — Create and manage discounts
- **Inventory Tracking** — Monitor stock levels
- **Store Settings** — Configure store parameters

### 🎨 Design
- **Black & Gold Theme** — Premium dark theme with golden accents
- **Glow Effects** — Animated golden glow on buttons, cards, and inputs
- **Fully Responsive** — Mobile, tablet, and desktop optimized
- **RTL Support** — Full right-to-left layout for Arabic

---

## 📁 Project Structure

```
LAEL-IQ/
├── index.html                  # Homepage
├── css/
│   ├── style.css               # Main styles
│   ├── auth.css                # Authentication pages styles
│   ├── glow.css                # Glow effect overlay
│   ├── responsive.css          # Mobile/tablet responsiveness
│   ├── admin.css               # Admin panel styles
│   └── admin-responsive.css    # Admin panel responsiveness
├── js/
│   ├── script.js               # Main store logic (cart, favorites, search, checkout)
│   ├── auth.js                 # Authentication system
│   ├── navbar.js               # Navigation bar logic
│   ├── profile.js              # Profile picture & admin icon
│   ├── layout.js               # Header/notification layout fixes
│   ├── orders.js               # Order history management
│   ├── payment.js              # Payment processing
│   └── admin/
│       └── admin-orders.js     # Admin order management
├── pages/
│   ├── login.html              # Login / Register page
│   ├── account.html            # User account / profile
│   ├── cart.html               # Shopping cart
│   ├── checkout.html           # Checkout page
│   ├── favorites.html          # Wishlist / favorites
│   ├── orders.html             # Order history
│   ├── order-success.html      # Order confirmation
│   ├── payment.html            # Payment form
│   ├── product.html            # Single product view
│   └── admin/
│       ├── dashboard.html      # Admin dashboard
│       ├── login.html          # Admin login
│       ├── products.html       # Manage all products
│       ├── product.html        # Add/edit single product
│       ├── categories.html     # Manage categories
│       ├── orders.html         # Manage orders
│       ├── customers.html      # View customers
│       ├── offers.html         # Manage offers/discounts
│       ├── inventory.html      # Inventory tracking
│       └── settings.html       # Store settings
├── assets/
│   └── images/
│       └── hero.jpg            # Hero section background
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server (recommended for proper path resolution)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/LAEL-IQ.git
   cd LAEL-IQ
   ```

2. **Start a local server** (choose one):
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if http-server is installed)
   npx http-server

   # VS Code
   # Install "Live Server" extension → Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Admin Access
1. Open the admin emails list in [`js/profile.js`](js/profile.js) and add your email to `ADMIN_EMAILS`
2. Register an account with that same email
3. The admin icon (⚙️) will appear in the navbar — click to access the dashboard

---

## 💳 Payment Integration

The payment system is **frontend-ready** and prepared for backend integration:

```
POST /api/payments/charge
```

**Expected server responses:**
```json
{ "success": true,  "orderId": "...", "transactionId": "..." }
{ "success": false, "code": "INSUFFICIENT_FUNDS" }
{ "success": false, "code": "CARD_DECLINED" }
```

> ⚠️ **Important:** Real payment processing requires a backend server and a payment gateway (e.g., Stripe, PayPal). The current frontend is ready for integration but does not process real payments.

---

## 🛠️ Customization

### Glow Effects
Edit the CSS variables at the top of [`css/glow.css`](css/glow.css) to customize glow colors and intensity:
```css
:root {
    --glow-color: #d4af37;
    --glow-intensity: 0.6;
}
```

To disable glow effects, remove the `<link rel="stylesheet" href="...glow.css">` line from the HTML files.

### Theme Colors
The main gold and dark theme colors are defined in [`css/style.css`](css/style.css).

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**LAEL IQ** — From Iraq To The World 🇮🇶

</div>
