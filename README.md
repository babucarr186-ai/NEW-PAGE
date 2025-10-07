# ShopZone - Modern E-commerce Website

A fully responsive, modern e-commerce website built with HTML5, CSS3, and vanilla JavaScript. Features a complete shopping experience with product catalog, shopping cart, checkout process, and mobile-optimized design.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add, remove, and manage cart items with persistent storage
- **Checkout Process**: Multi-step checkout with form validation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations

### Product Features
- Product grid and list views
- Advanced filtering by category, brand, price, and rating
- Real-time search functionality
- Product quick view modal
- Product ratings and reviews display
- Featured products section

### Shopping Cart Features
- Add/remove products with quantity controls
- Persistent cart storage using localStorage
- Cart sidebar with item management
- Real-time cart total calculation
- Empty cart state handling

### Checkout Features
- Multi-step checkout process (Shipping → Payment → Review → Confirmation)
- Form validation with real-time feedback
- Multiple payment method options (Credit Card, PayPal, Apple Pay)
- Promo code system with validation
- Order summary with tax and shipping calculation
- Order confirmation with receipt generation

### Mobile Optimization
- Touch-friendly interface with proper tap targets
- Mobile navigation menu
- Responsive product grids
- Mobile-optimized forms and buttons
- Swipe-friendly interactions

## 📁 Project Structure

```
NEW-PAGE/
├── index.html              # Home page
├── products.html           # Product catalog page
├── checkout.html           # Checkout process page
├── css/
│   ├── style.css          # Main stylesheet
│   ├── products.css       # Product page specific styles
│   └── checkout.css       # Checkout page specific styles
├── js/
│   ├── main.js           # Main application logic
│   ├── products.js       # Product data and management
│   ├── cart.js           # Shopping cart functionality
│   ├── checkout.js       # Checkout process logic
│   └── filters.js        # Product filtering system
└── images/
    └── products/          # Product images directory
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with modern web standards
- **CSS3**: Flexbox, Grid, Custom properties (CSS variables), Media queries
- **JavaScript (ES6+)**: Classes, Modules, Local Storage, Event handling
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Typography (Inter font family)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px  
- **Mobile**: 320px - 767px

## 🎨 Design Features

### Color Scheme
- Primary Blue: `#2563eb`
- Secondary Orange: `#f59e0b`
- Accent Green: `#10b981`
- Neutral Grays: Various shades for text and backgrounds

### Typography
- Font Family: Inter (Google Fonts)
- Hierarchy: Clear heading and body text structure
- Responsive font sizes with proper line heights

### Animations & Interactions
- Smooth CSS transitions (0.3s ease)
- Hover effects on interactive elements
- Loading states and micro-interactions
- Scroll-based animations

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Navigate** between pages using the navigation menu
4. **Test features** like adding products to cart and checkout process

### Local Development

For a better development experience, serve the files using a local server:

## Monorepo Structure

```
NEW-PAGE/
    admin.html, products.html, ... (static legacy pages)
    mysite/        -> Vite + React frontend (Gallery UI consuming Sanity)
    studio/        -> Sanity Studio (content editing UI)
    .vscode/tasks.json -> Dev convenience tasks
```

## Sanity + Frontend Integration

The React app (`mysite`) fetches documents of type `galleryItem` from the Sanity dataset and renders them in a responsive gallery. Adding or editing items in Studio reflects instantly (hot cache permitting) in the frontend—no code changes required.

### Gallery Schema Fields
| Field | Purpose |
| ----- | ------- |
| title | Display name under the image |
| slug | (Optional) For future routing / deep links |
| image | Main asset (uses hotspot) |
| description | Short supporting copy |
| alt | Accessibility / SEO alt text |
| tags | Optional grouping / filtering later |
| order | Manual ordering (lower first) |
| published | Toggle visibility |

## Environment Variables

Create a `.env` file inside `mysite` (copy from `.env.example`):

```
VITE_SANITY_PROJECT_ID=yourProjectId
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2025-01-01
VITE_SANITY_USE_CDN=true
```

Values come from the Sanity manage project settings. Only the project ID usually changes.

## Running Locally

Prereqs: Node 18+ recommended.

Option A (individual):
```
cd mysite
npm install
npm run dev

# new terminal
cd studio
npm install
npm run dev
```

Option B (VS Code tasks):
Open the command palette -> Tasks: Run Task -> choose `dev:all` (auto defined in `.vscode/tasks.json`).

Expected URLs:
* Frontend: http://localhost:5173
* Studio:   http://localhost:3333

## Zero‑Code Content Updates
1. Open Sanity Studio (http://localhost:3333 or deployed studio).
2. Create / edit / reorder gallery items.
3. Set `published = true` and optionally adjust `order`.
4. The frontend auto-refreshes (Vite hot module reload). Hard-refresh if needed to invalidate the CDN.

## Deployment Notes

Front-end build (Vite):
```
cd mysite
npm run build
```
Outputs to `mysite/dist/` (can be hosted on any static host or GitHub Pages subpath).

Sanity Studio build:
```
cd studio
npm run build
```
Generates a production bundle inside `studio/dist/` (can be deployed to Sanity hosted studio with `npm run deploy` if configured or any static hosting).

## Future Enhancements (Backlog)
* Add filtering UI by tag
* Add lightbox / modal viewer
* CI workflow for building both apps
* Image lazy loading skeletons
* Use GROQ vision plugin during dev

## Troubleshooting
| Issue | Fix |
| ----- | ---- |
| Empty gallery | Confirm at least one `galleryItem` is published and dataset matches `.env` |
| 404 images | Check that the image asset is fully uploaded; retry publish |
| Env vars ignored | Ensure file name is `.env` (not `.env.txt`) and restart `npm run dev` |
| Wrong project | Update `VITE_SANITY_PROJECT_ID` and restart dev server |

---
This document now reflects the integrated React + Sanity gallery setup.

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🛒 How to Use

### Shopping Experience
1. **Browse Products**: Visit the products page to see all available items
2. **Filter & Search**: Use the sidebar filters or search bar to find specific products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon to see your items
5. **Checkout**: Click "Checkout" to begin the purchase process

### Admin Features (Demo)
- Product data is stored in `js/products.js` for easy modification
- Add new products by extending the products array
- Customize categories, brands, and pricing
- Modify promo codes in the checkout system

## 🎯 Key Components

### Product Manager (`js/products.js`)
- Manages product data and rendering
- Handles filtering, sorting, and pagination
- Provides product search functionality

### Shopping Cart (`js/cart.js`)
- Persistent cart storage
- Item quantity management
- Price calculations
- Cart state management

### Checkout System (`js/checkout.js`)
- Multi-step form handling
- Payment processing simulation
- Order confirmation
- Form validation

### Filters System (`js/filters.js`)
- Advanced product filtering
- URL parameter handling
- Filter state management
- Real-time filter application

## 🔧 Customization

### Adding Products
Edit the `getProductsData()` method in `js/products.js`:

```javascript
{
    id: 'unique-id',
    name: 'Product Name',
    category: 'electronics', // electronics, fashion, home, sports
    brand: 'brand-name',
    price: 99.99,
    oldPrice: 129.99, // Optional
    rating: 4.5,
    reviewCount: 123,
    description: 'Product description...',
    image: 'path/to/image.jpg', // Optional
    inStock: true,
    featured: false
}
```

### Styling Customization
Modify CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --accent-color: #your-color;
    /* Add more customizations */
}
```

### Payment Integration
Replace the simulated payment processing in `js/checkout.js` with real payment gateway integration (Stripe, PayPal, etc.).

## 🌟 Performance Features

- **Lazy Loading**: Images load as they come into view
- **Debounced Search**: Reduces API calls during typing
- **Local Storage**: Persistent cart without server dependency
- **Optimized CSS**: Efficient selectors and minimal repaints
- **Compressed Assets**: Minified for production use

## 🔒 Security Considerations

For production use, implement:
- Server-side validation for all forms
- Secure payment processing with HTTPS
- Input sanitization and XSS protection
- CSRF protection for form submissions
- Content Security Policy (CSP) headers

## 📊 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across devices
5. Submit a pull request with detailed description

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For questions or support:
- Check the code comments for implementation details
- Review the browser console for any error messages
- Ensure all files are properly linked and accessible

## 🚀 Future Enhancements

Potential improvements for production use:
- User authentication and accounts
- Product reviews and ratings system
- Wishlist functionality
- Order history and tracking
- Admin panel for product management
- Real payment gateway integration
- Email notifications
- SEO optimization
- Progressive Web App (PWA) features
- Advanced analytics integration

---

**Built with ❤️ for modern web development**