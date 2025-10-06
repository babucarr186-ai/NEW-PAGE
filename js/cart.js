// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartUI();
    }

    bindEvents() {
        // Cart icon click
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.toggleCart());
        }

        // Close cart button
        const closeCart = document.getElementById('close-cart');
        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }

        // Cart overlay click
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Listen for add to cart events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                const productData = this.extractProductData(e.target);
                if (productData) {
                    this.addToCart(productData);
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }

    extractProductData(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return null;

        const id = button.dataset.productId || 
                  productCard.dataset.productId || 
                  Date.now().toString();
        
        const name = productCard.querySelector('h3')?.textContent || 'Unknown Product';
        const priceElement = productCard.querySelector('.price');
        const price = priceElement ? 
                     parseFloat(priceElement.textContent.replace('$', '')) : 0;
        
        const imageElement = productCard.querySelector('.product-image img') ||
                           productCard.querySelector('.product-image');
        const image = imageElement?.src || null;

        return {
            id,
            name,
            price,
            image,
            quantity: 1
        };
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push({ ...product });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`);
        
        // Animate cart icon
        this.animateCartIcon();
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    getCartTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getCartItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.name}">` : 
                        '<div class="placeholder-image"><i class="fas fa-image"></i></div>'
                    }
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="cart.removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCartTotal() {
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = this.getCartTotal().toFixed(2);
        }
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }

    showNotification(message) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveCart() {
        try {
            localStorage.setItem('shopzone_cart', JSON.stringify(this.items));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('shopzone_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
            return [];
        }
    }

    // Export cart data for checkout
    getCartData() {
        return {
            items: this.items,
            total: this.getCartTotal(),
            count: this.getCartItemCount()
        };
    }

    // Import cart data (useful for checkout page)
    setCartData(data) {
        if (data && data.items) {
            this.items = data.items;
            this.saveCart();
            this.updateCartUI();
        }
    }
}

// CSS for notifications and empty cart
const additionalStyles = `
<style>
.cart-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.empty-cart {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--text-light);
}

.empty-cart i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--border-light);
}

.empty-cart p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.continue-shopping {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    transition: var(--transition);
}

.continue-shopping:hover {
    background: var(--primary-hover);
}

.cart-item-image {
    width: 60px;
    height: 60px;
    border-radius: var(--border-radius);
    overflow: hidden;
    flex-shrink: 0;
}

.cart-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder-image {
    width: 100%;
    height: 100%;
    background: var(--bg-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
    font-size: 1.5rem;
}

.cart-item-price {
    font-weight: 600;
    color: var(--accent-color);
    margin: 0.5rem 0;
}
</style>
`;

// Add additional styles to head
if (!document.querySelector('#cart-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'cart-styles';
    styleElement.innerHTML = additionalStyles;
    document.head.appendChild(styleElement);
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}