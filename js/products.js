// Products Data and Management
class ProductManager {
    constructor() {
        this.products = this.getProductsData();
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentSort = 'default';
        this.currentView = 'grid';
        this.filters = {
            categories: [],
            brands: [],
            ratings: [],
            priceMin: 0,
            priceMax: 1000,
            search: ''
        };
    }

    getProductsData() {
        // Try to load from localStorage first
        const storedProducts = localStorage.getItem('ecommerce_products');
        if (storedProducts) {
            try {
                return JSON.parse(storedProducts);
            } catch (e) {
                console.error('Error parsing stored products:', e);
            }
        }

        // Default products if none stored
        const defaultProducts = [
            {
                id: '1',
                name: 'Wireless Bluetooth Headphones',
                category: 'electronics',
                brand: 'apple',
                price: 299.99,
                oldPrice: 399.99,
                rating: 4.5,
                reviewCount: 128,
                description: 'Premium wireless headphones with noise cancellation and superior sound quality.',
                image: null,
                features: ['Noise Cancellation', 'Wireless', 'Long Battery Life'],
                inStock: true,
                featured: true
            },
            {
                id: '2',
                name: 'Smart Fitness Watch',
                category: 'electronics',
                brand: 'samsung',
                price: 199.99,
                oldPrice: null,
                rating: 4.2,
                reviewCount: 89,
                description: 'Track your fitness goals with this advanced smartwatch.',
                image: null,
                features: ['Heart Rate Monitor', 'GPS', 'Waterproof'],
                inStock: true,
                featured: true
            },
            {
                id: '3',
                name: 'Professional Running Shoes',
                category: 'sports',
                brand: 'nike',
                price: 129.99,
                oldPrice: 149.99,
                rating: 4.7,
                reviewCount: 245,
                description: 'Lightweight and comfortable running shoes for serious athletes.',
                image: null,
                features: ['Lightweight', 'Breathable', 'Cushioned'],
                inStock: true,
                featured: true
            },
            {
                id: '4',
                name: 'Organic Cotton T-Shirt',
                category: 'fashion',
                brand: 'nike',
                price: 29.99,
                oldPrice: null,
                rating: 4.0,
                reviewCount: 67,
                description: 'Comfortable and eco-friendly t-shirt made from organic cotton.',
                image: null,
                features: ['Organic Cotton', 'Comfortable Fit', 'Eco-Friendly'],
                inStock: true,
                featured: false
            },
            {
                id: '5',
                name: 'Smartphone with 5G',
                category: 'electronics',
                brand: 'samsung',
                price: 799.99,
                oldPrice: 899.99,
                rating: 4.6,
                reviewCount: 312,
                description: 'Latest smartphone with 5G connectivity and advanced camera.',
                image: null,
                features: ['5G Ready', 'Advanced Camera', 'Fast Processor'],
                inStock: true,
                featured: true
            },
            {
                id: '6',
                name: 'Home Coffee Machine',
                category: 'home',
                brand: 'apple',
                price: 299.99,
                oldPrice: null,
                rating: 4.3,
                reviewCount: 156,
                description: 'Professional-grade coffee machine for your home kitchen.',
                image: null,
                features: ['Multiple Brew Sizes', 'Programmable', 'Easy Clean'],
                inStock: true,
                featured: false
            },
            {
                id: '7',
                name: 'Yoga Exercise Mat',
                category: 'sports',
                brand: 'adidas',
                price: 49.99,
                oldPrice: 69.99,
                rating: 4.4,
                reviewCount: 98,
                description: 'Non-slip yoga mat perfect for all types of exercise.',
                image: null,
                features: ['Non-slip Surface', 'Easy to Clean', 'Portable'],
                inStock: true,
                featured: false
            },
            {
                id: '8',
                name: 'Designer Backpack',
                category: 'fashion',
                brand: 'nike',
                price: 89.99,
                oldPrice: null,
                rating: 4.1,
                reviewCount: 78,
                description: 'Stylish and functional backpack for work or travel.',
                image: null,
                features: ['Water Resistant', 'Multiple Compartments', 'Ergonomic'],
                inStock: true,
                featured: false
            },
            {
                id: '9',
                name: 'Wireless Mouse',
                category: 'electronics',
                brand: 'apple',
                price: 79.99,
                oldPrice: null,
                rating: 4.2,
                reviewCount: 134,
                description: 'Ergonomic wireless mouse with precision tracking.',
                image: null,
                features: ['Wireless', 'Ergonomic Design', 'Long Battery'],
                inStock: true,
                featured: false
            },
            {
                id: '10',
                name: 'Indoor Plant Pot Set',
                category: 'home',
                brand: 'apple',
                price: 39.99,
                oldPrice: 49.99,
                rating: 4.0,
                reviewCount: 45,
                description: 'Beautiful ceramic pots perfect for indoor plants.',
                image: null,
                features: ['Drainage Holes', 'Decorative Design', 'Set of 3'],
                inStock: true,
                featured: false
            },
            {
                id: '11',
                name: 'Bluetooth Speaker',
                category: 'electronics',
                brand: 'samsung',
                price: 149.99,
                oldPrice: 179.99,
                rating: 4.5,
                reviewCount: 203,
                description: 'Portable Bluetooth speaker with rich, clear sound.',
                image: null,
                features: ['Portable', 'Waterproof', 'Long Battery Life'],
                inStock: true,
                featured: true
            },
            {
                id: '12',
                name: 'Casual Denim Jeans',
                category: 'fashion',
                brand: 'nike',
                price: 79.99,
                oldPrice: null,
                rating: 3.9,
                reviewCount: 89,
                description: 'Classic denim jeans with comfortable fit.',
                image: null,
                features: ['Comfortable Fit', 'Durable Material', 'Classic Style'],
                inStock: true,
                featured: false
            },
            {
                id: '13',
                name: 'Gaming Mechanical Keyboard',
                category: 'electronics',
                brand: 'apple',
                price: 159.99,
                oldPrice: 199.99,
                rating: 4.7,
                reviewCount: 167,
                description: 'Professional gaming keyboard with mechanical switches.',
                image: null,
                features: ['Mechanical Switches', 'RGB Lighting', 'Programmable'],
                inStock: true,
                featured: false
            },
            {
                id: '14',
                name: 'Resistance Band Set',
                category: 'sports',
                brand: 'adidas',
                price: 24.99,
                oldPrice: null,
                rating: 4.3,
                reviewCount: 112,
                description: 'Complete resistance band set for strength training.',
                image: null,
                features: ['Multiple Resistance Levels', 'Portable', 'Exercise Guide'],
                inStock: true,
                featured: false
            },
            {
                id: '15',
                name: 'Scented Candle Collection',
                category: 'home',
                brand: 'apple',
                price: 59.99,
                oldPrice: 79.99,
                rating: 4.2,
                reviewCount: 73,
                description: 'Luxury scented candles to create the perfect ambiance.',
                image: null,
                features: ['Natural Wax', 'Long Burn Time', 'Premium Scents'],
                inStock: true,
                featured: false
            },
            {
                id: '16',
                name: 'Leather Wallet',
                category: 'fashion',
                brand: 'nike',
                price: 49.99,
                oldPrice: null,
                rating: 4.1,
                reviewCount: 56,
                description: 'Premium leather wallet with RFID blocking technology.',
                image: null,
                features: ['Genuine Leather', 'RFID Blocking', 'Multiple Slots'],
                inStock: true,
                featured: false
            }
        ];

        // Save default products to localStorage
        this.saveProductsToStorage(defaultProducts);
        return defaultProducts;
    }
            {
                id: '1',
                name: 'Wireless Bluetooth Headphones',
                category: 'electronics',
                brand: 'apple',
                price: 299.99,
                oldPrice: 399.99,
                rating: 4.5,
                reviewCount: 128,
                description: 'Premium wireless headphones with noise cancellation and superior sound quality.',
                image: null,
                features: ['Noise Cancellation', 'Wireless', 'Long Battery Life'],
                inStock: true,
                featured: true
            },
            {
                id: '2',
                name: 'Smart Fitness Watch',
                category: 'electronics',
                brand: 'samsung',
                price: 199.99,
                oldPrice: null,
                rating: 4.2,
                reviewCount: 89,
                description: 'Track your fitness goals with this advanced smartwatch.',
                image: null,
                features: ['Heart Rate Monitor', 'GPS', 'Waterproof'],
                inStock: true,
                featured: true
            },
            {
                id: '3',
                name: 'Professional Running Shoes',
                category: 'sports',
                brand: 'nike',
                price: 129.99,
                oldPrice: 149.99,
                rating: 4.7,
                reviewCount: 245,
                description: 'Lightweight and comfortable running shoes for serious athletes.',
                image: null,
                features: ['Lightweight', 'Breathable', 'Cushioned'],
                inStock: true,
                featured: true
            },
            {
                id: '4',
                name: 'Organic Cotton T-Shirt',
                category: 'fashion',
                brand: 'nike',
                price: 29.99,
                oldPrice: null,
                rating: 4.0,
                reviewCount: 67,
                description: 'Comfortable and eco-friendly t-shirt made from organic cotton.',
                image: null,
                features: ['Organic Cotton', 'Comfortable Fit', 'Eco-Friendly'],
                inStock: true,
                featured: false
            },
            {
                id: '5',
                name: 'Smartphone with 5G',
                category: 'electronics',
                brand: 'samsung',
                price: 799.99,
                oldPrice: 899.99,
                rating: 4.6,
                reviewCount: 312,
                description: 'Latest smartphone with 5G connectivity and advanced camera.',
                image: null,
                features: ['5G Ready', 'Advanced Camera', 'Fast Processor'],
                inStock: true,
                featured: true
            },
            {
                id: '6',
                name: 'Home Coffee Machine',
                category: 'home',
                brand: 'apple',
                price: 299.99,
                oldPrice: null,
                rating: 4.3,
                reviewCount: 156,
                description: 'Professional-grade coffee machine for your home kitchen.',
                image: null,
                features: ['Multiple Brew Sizes', 'Programmable', 'Easy Clean'],
                inStock: true,
                featured: false
            },
            {
                id: '7',
                name: 'Yoga Exercise Mat',
                category: 'sports',
                brand: 'adidas',
                price: 49.99,
                oldPrice: 69.99,
                rating: 4.4,
                reviewCount: 98,
                description: 'Non-slip yoga mat perfect for all types of exercise.',
                image: null,
                features: ['Non-slip Surface', 'Easy to Clean', 'Portable'],
                inStock: true,
                featured: false
            },
            {
                id: '8',
                name: 'Designer Backpack',
                category: 'fashion',
                brand: 'nike',
                price: 89.99,
                oldPrice: null,
                rating: 4.1,
                reviewCount: 78,
                description: 'Stylish and functional backpack for work or travel.',
                image: null,
                features: ['Water Resistant', 'Multiple Compartments', 'Ergonomic'],
                inStock: true,
                featured: false
            },
            {
                id: '9',
                name: 'Wireless Mouse',
                category: 'electronics',
                brand: 'apple',
                price: 79.99,
                oldPrice: null,
                rating: 4.2,
                reviewCount: 134,
                description: 'Ergonomic wireless mouse with precision tracking.',
                image: null,
                features: ['Wireless', 'Ergonomic Design', 'Long Battery'],
                inStock: true,
                featured: false
            },
            {
                id: '10',
                name: 'Indoor Plant Pot Set',
                category: 'home',
                brand: 'apple',
                price: 39.99,
                oldPrice: 49.99,
                rating: 4.0,
                reviewCount: 45,
                description: 'Beautiful ceramic pots perfect for indoor plants.',
                image: null,
                features: ['Drainage Holes', 'Decorative Design', 'Set of 3'],
                inStock: true,
                featured: false
            },
            {
                id: '11',
                name: 'Bluetooth Speaker',
                category: 'electronics',
                brand: 'samsung',
                price: 149.99,
                oldPrice: 179.99,
                rating: 4.5,
                reviewCount: 203,
                description: 'Portable Bluetooth speaker with rich, clear sound.',
                image: null,
                features: ['Portable', 'Waterproof', 'Long Battery Life'],
                inStock: true,
                featured: true
            },
            {
                id: '12',
                name: 'Casual Denim Jeans',
                category: 'fashion',
                brand: 'nike',
                price: 79.99,
                oldPrice: null,
                rating: 3.9,
                reviewCount: 89,
                description: 'Classic denim jeans with comfortable fit.',
                image: null,
                features: ['Comfortable Fit', 'Durable Material', 'Classic Style'],
                inStock: true,
                featured: false
            },
            {
                id: '13',
                name: 'Gaming Mechanical Keyboard',
                category: 'electronics',
                brand: 'apple',
                price: 159.99,
                oldPrice: 199.99,
                rating: 4.7,
                reviewCount: 167,
                description: 'Professional gaming keyboard with mechanical switches.',
                image: null,
                features: ['Mechanical Switches', 'RGB Lighting', 'Programmable'],
                inStock: true,
                featured: false
            },
            {
                id: '14',
                name: 'Resistance Band Set',
                category: 'sports',
                brand: 'adidas',
                price: 24.99,
                oldPrice: null,
                rating: 4.3,
                reviewCount: 112,
                description: 'Complete resistance band set for strength training.',
                image: null,
                features: ['Multiple Resistance Levels', 'Portable', 'Exercise Guide'],
                inStock: true,
                featured: false
            },
            {
                id: '15',
                name: 'Scented Candle Collection',
                category: 'home',
                brand: 'apple',
                price: 59.99,
                oldPrice: 79.99,
                rating: 4.2,
                reviewCount: 73,
                description: 'Luxury scented candles to create the perfect ambiance.',
                image: null,
                features: ['Natural Wax', 'Long Burn Time', 'Premium Scents'],
                inStock: true,
                featured: false
            },
            {
                id: '16',
                name: 'Leather Wallet',
                category: 'fashion',
                brand: 'nike',
                price: 49.99,
                oldPrice: null,
                rating: 4.1,
                reviewCount: 56,
                description: 'Premium leather wallet with RFID blocking technology.',
                image: null,
                features: ['Genuine Leather', 'RFID Blocking', 'Multiple Slots'],
                inStock: true,
                featured: false
            }
        ];

        // Save default products to localStorage
        this.saveProductsToStorage(defaultProducts);
        return defaultProducts;
    }
            {
                id: '2',
                name: 'Smart Fitness Watch',
                category: 'electronics',
                brand: 'samsung',
                price: 199.99,
                oldPrice: null,
                rating: 4.2,
                reviewCount: 89,
                description: 'Track your fitness goals with this advanced smartwatch.',
                image: null,
                features: ['Heart Rate Monitor', 'GPS', 'Waterproof'],
                inStock: true,
                featured: true
            },
            {
                id: '3',
                name: 'Professional Running Shoes',
                category: 'sports',
                brand: 'nike',
                price: 129.99,
                oldPrice: 149.99,
                rating: 4.7,
                reviewCount: 245,
                description: 'Lightweight and comfortable running shoes for serious athletes.',
                image: null,
                features: ['Lightweight', 'Breathable', 'Cushioned'],
                inStock: true,
                featured: true
            },
            {
                id: '4',
                name: 'Organic Cotton T-Shirt',
                category: 'fashion',
                brand: 'nike',
                price: 29.99,
                oldPrice: null,
                rating: 4.0,
                reviewCount: 67,
                description: 'Comfortable and eco-friendly t-shirt made from organic cotton.',
                image: null,
                features: ['Organic Cotton', 'Comfortable Fit', 'Eco-Friendly'],
                inStock: true,
                featured: false
            },
            {
                id: '5',
                name: 'Smartphone with 5G',
                category: 'electronics',
                brand: 'samsung',
                price: 799.99,
                oldPrice: 899.99,
                rating: 4.6,
                reviewCount: 312,
                description: 'Latest smartphone with 5G connectivity and advanced camera.',
                image: null,
                features: ['5G Ready', 'Advanced Camera', 'Fast Processor'],
                inStock: true,
                featured: true
            },
            {
                id: '6',
                name: 'Home Coffee Machine',
                category: 'home',
                brand: 'apple',
                price: 299.99,
                oldPrice: null,
                rating: 4.3,
                reviewCount: 156,
                description: 'Professional-grade coffee machine for your home kitchen.',
                image: null,
                features: ['Multiple Brew Sizes', 'Programmable', 'Easy Clean'],
                inStock: true,
                featured: false
            },
            {
                id: '7',
                name: 'Yoga Exercise Mat',
                category: 'sports',
                brand: 'adidas',
                price: 49.99,
                oldPrice: 69.99,
                rating: 4.4,
                reviewCount: 98,
                description: 'Non-slip yoga mat perfect for all types of exercise.',
                image: null,
                features: ['Non-slip Surface', 'Easy to Clean', 'Portable'],
                inStock: true,
                featured: false
            },
            {
                id: '8',
                name: 'Designer Backpack',
                category: 'fashion',
                brand: 'nike',
                price: 89.99,
                oldPrice: null,
                rating: 4.1,
                reviewCount: 78,
                description: 'Stylish and functional backpack for work or travel.',
                image: null,
                features: ['Water Resistant', 'Multiple Compartments', 'Ergonomic'],
                inStock: true,
                featured: false
            },
            {
                id: '9',
                name: 'Wireless Mouse',
                category: 'electronics',
                brand: 'apple',
                price: 79.99,
                oldPrice: null,
                rating: 4.2,
                reviewCount: 134,
                description: 'Ergonomic wireless mouse with precision tracking.',
                image: null,
                features: ['Wireless', 'Ergonomic Design', 'Long Battery'],
                inStock: true,
                featured: false
            },
            {
                id: '10',
                name: 'Indoor Plant Pot Set',
                category: 'home',
                brand: 'apple',
                price: 39.99,
                oldPrice: 49.99,
                rating: 4.0,
                reviewCount: 45,
                description: 'Beautiful ceramic pots perfect for indoor plants.',
                image: null,
                features: ['Drainage Holes', 'Decorative Design', 'Set of 3'],
                inStock: true,
                featured: false
            },
            {
                id: '11',
                name: 'Bluetooth Speaker',
                category: 'electronics',
                brand: 'samsung',
                price: 149.99,
                oldPrice: 179.99,
                rating: 4.5,
                reviewCount: 203,
                description: 'Portable Bluetooth speaker with rich, clear sound.',
                image: null,
                features: ['Portable', 'Waterproof', 'Long Battery Life'],
                inStock: true,
                featured: true
            },
            {
                id: '12',
                name: 'Casual Denim Jeans',
                category: 'fashion',
                brand: 'nike',
                price: 79.99,
                oldPrice: null,
                rating: 3.9,
                reviewCount: 89,
                description: 'Classic denim jeans with comfortable fit.',
                image: null,
                features: ['Comfortable Fit', 'Durable Material', 'Classic Style'],
                inStock: true,
                featured: false
            },
            {
                id: '13',
                name: 'Gaming Mechanical Keyboard',
                category: 'electronics',
                brand: 'apple',
                price: 159.99,
                oldPrice: 199.99,
                rating: 4.7,
                reviewCount: 167,
                description: 'Professional gaming keyboard with mechanical switches.',
                image: null,
                features: ['Mechanical Switches', 'RGB Lighting', 'Programmable'],
                inStock: true,
                featured: false
            },
            {
                id: '14',
                name: 'Resistance Band Set',
                category: 'sports',
                brand: 'adidas',
                price: 24.99,
                oldPrice: null,
                rating: 4.3,
                reviewCount: 112,
                description: 'Complete resistance band set for strength training.',
                image: null,
                features: ['Multiple Resistance Levels', 'Portable', 'Exercise Guide'],
                inStock: true,
                featured: false
            },
            {
                id: '15',
                name: 'Scented Candle Collection',
                category: 'home',
                brand: 'apple',
                price: 59.99,
                oldPrice: 79.99,
                rating: 4.2,
                reviewCount: 73,
                description: 'Luxury scented candles to create the perfect ambiance.',
                image: null,
                features: ['Natural Wax', 'Long Burn Time', 'Premium Scents'],
                inStock: true,
                featured: false
            },
            {
                id: '16',
                name: 'Leather Wallet',
                category: 'fashion',
                brand: 'nike',
                price: 49.99,
                oldPrice: null,
                rating: 4.1,
                reviewCount: 56,
                description: 'Premium leather wallet with RFID blocking technology.',
                image: null,
                features: ['Genuine Leather', 'RFID Blocking', 'Multiple Slots'],
                inStock: true,
                featured: false
            }
        ];
    }

    renderProducts(container, products = null) {
        const productsToRender = products || this.getFilteredProducts();
        
        if (!container) return;

        if (productsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = productsToRender.map(product => this.renderProductCard(product)).join('');
    }

    renderProductCard(product) {
        const discountPercentage = product.oldPrice ? 
            Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}">` : 
                        `<i class="fas fa-${this.getCategoryIcon(product.category)}"></i>`
                    }
                    ${discountPercentage > 0 ? `<div class="discount-badge">${discountPercentage}% OFF</div>` : ''}
                    ${!product.inStock ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <p>${product.description}</p>
                    <div class="product-price">
                        <span class="price">${new Intl.NumberFormat('en-GM', {
                            style: 'currency',
                            currency: 'GMD'
                        }).format(product.price)}</span>
                        ${product.oldPrice ? `<span class="old-price">${new Intl.NumberFormat('en-GM', {
                            style: 'currency',
                            currency: 'GMD'
                        }).format(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart ${!product.inStock ? 'disabled' : ''}" 
                                data-product-id="${product.id}"
                                ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="quick-view-btn" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHtml = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }

        return starsHtml;
    }

    getCategoryIcon(category) {
        const icons = {
            electronics: 'laptop',
            fashion: 'tshirt',
            home: 'home',
            sports: 'dumbbell',
            books: 'book'
        };
        return icons[category] || 'box';
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && 
                !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Brand filter
            if (this.filters.brands.length > 0 && 
                !this.filters.brands.includes(product.brand)) {
                return false;
            }

            // Rating filter
            if (this.filters.ratings.length > 0) {
                const matchesRating = this.filters.ratings.some(rating => {
                    return product.rating >= parseFloat(rating);
                });
                if (!matchesRating) return false;
            }

            // Price filter
            if (product.price < this.filters.priceMin || 
                product.price > this.filters.priceMax) {
                return false;
            }

            // Search filter
            if (this.filters.search && 
                !product.name.toLowerCase().includes(this.filters.search.toLowerCase()) &&
                !product.description.toLowerCase().includes(this.filters.search.toLowerCase())) {
                return false;
            }

            return true;
        });

        this.applySorting();
        this.currentPage = 1; // Reset to first page
    }

    applySorting() {
        switch (this.currentSort) {
            case 'name-asc':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // In a real app, you'd sort by creation date
                this.filteredProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
                break;
            default:
                // Keep original order for featured products first
                this.filteredProducts.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
                });
        }
    }

    getFilteredProducts() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
    }

    getFeaturedProducts(limit = 6) {
        return this.products.filter(product => product.featured).slice(0, limit);
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getTotalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }

    setPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    updateFilters(newFilters) {
        Object.assign(this.filters, newFilters);
        this.applyFilters();
    }

    setSorting(sortType) {
        this.currentSort = sortType;
        this.applySorting();
    }

    setView(viewType) {
        this.currentView = viewType;
    }

    clearFilters() {
        this.filters = {
            categories: [],
            brands: [],
            ratings: [],
            priceMin: 0,
            priceMax: 1000,
            search: ''
        };
        this.applyFilters();
    }

    getFilterStats() {
        return {
            total: this.products.length,
            filtered: this.filteredProducts.length,
            currentPage: this.currentPage,
            totalPages: this.getTotalPages(),
            itemsPerPage: this.itemsPerPage
        };
    }

    saveProductsToStorage(products) {
        try {
            localStorage.setItem('ecommerce_products', JSON.stringify(products));
        } catch (e) {
            console.error('Error saving products to localStorage:', e);
        }
    }

    addProduct(product) {
        // Generate new ID
        const maxId = Math.max(...this.products.map(p => parseInt(p.id)), 0);
        product.id = (maxId + 1).toString();

        // Add timestamps
        product.createdAt = new Date().toISOString();
        product.updatedAt = new Date().toISOString();

        // Add to products array
        this.products.push(product);

        // Save to localStorage
        this.saveProductsToStorage(this.products);

        // Reapply filters to include new product
        this.applyFilters();

        return product;
    }

    updateProduct(id, updates) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveProductsToStorage(this.products);
            this.applyFilters();
            return this.products[productIndex];
        }
        return null;
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            this.saveProductsToStorage(this.products);
            this.applyFilters();
            return deletedProduct;
        }
        return null;
    }

// Initialize product manager
window.productManager = new ProductManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
}