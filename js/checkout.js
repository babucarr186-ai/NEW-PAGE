// Checkout System
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            shipping: {},
            payment: {},
            promo: null
        };
        this.promoCodes = {
            'SAVE10': { type: 'percentage', value: 10, description: '10% off your order' },
            'WELCOME20': { type: 'percentage', value: 20, description: '20% off for new customers' },
            'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' },
            'SAVE50': { type: 'fixed', value: 50, description: '$50 off orders over $200' }
        };
        this.init();
    }

    init() {
        this.loadCartItems();
        this.updateOrderSummary();
        this.bindEvents();
        this.setupValidation();
        
        // Check if cart is empty
        if (!window.cart || window.cart.getCartItemCount() === 0) {
            this.showEmptyCart();
            return;
        }
    }

    bindEvents() {
        // Form submissions
        const shippingForm = document.getElementById('shipping-form');
        if (shippingForm) {
            shippingForm.addEventListener('submit', (e) => this.handleShippingSubmit(e));
        }

        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));
        }

        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => this.handlePaymentMethodChange(method.value));
        });

        // Promo code
        const applyPromo = document.getElementById('apply-promo');
        if (applyPromo) {
            applyPromo.addEventListener('click', () => this.applyPromoCode());
        }

        const promoInput = document.getElementById('promo-input');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', this.formatCardNumber);
        }

        // Expiry date formatting
        const expiry = document.getElementById('expiry');
        if (expiry) {
            expiry.addEventListener('input', this.formatExpiryDate);
        }

        // CVV validation
        const cvv = document.getElementById('cvv');
        if (cvv) {
            cvv.addEventListener('input', this.formatCVV);
        }
    }

    setupValidation() {
        // Real-time validation for all inputs
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Card number validation
        if (field.id === 'cardNumber' && value) {
            const cleanNumber = value.replace(/\s/g, '');
            if (cleanNumber.length < 13 || cleanNumber.length > 19) {
                isValid = false;
                errorMessage = 'Please enter a valid card number';
            }
        }

        // CVV validation
        if (field.id === 'cvv' && value) {
            if (value.length < 3 || value.length > 4) {
                isValid = false;
                errorMessage = 'Please enter a valid CVV';
            }
        }

        // Expiry date validation
        if (field.id === 'expiry' && value) {
            const [month, year] = value.split('/');
            const currentDate = new Date();
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            
            if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12 || expiryDate < currentDate) {
                isValid = false;
                errorMessage = 'Please enter a valid expiry date';
            }
        }

        this.setFieldError(field, isValid, errorMessage);
        return isValid;
    }

    setFieldError(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        } else {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    handleShippingSubmit(e) {
        e.preventDefault();
        const form = e.target;

        if (this.validateForm(form)) {
            // Collect form data
            const formData = new FormData(form);
            this.formData.shipping = Object.fromEntries(formData.entries());
            
            // Move to payment step
            this.goToStep(2);
        }
    }

    handlePaymentSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (paymentMethod === 'card') {
            if (this.validateForm(form)) {
                // Collect payment data (in real app, this would be handled securely)
                const formData = new FormData(form);
                this.formData.payment = {
                    method: paymentMethod,
                    ...Object.fromEntries(formData.entries())
                };
                
                // Move to review step
                this.goToStep(3);
                this.populateReviewData();
            }
        } else {
            // For other payment methods (PayPal, Apple Pay), skip form validation
            this.formData.payment = { method: paymentMethod };
            this.goToStep(3);
            this.populateReviewData();
        }
    }

    handlePaymentMethodChange(method) {
        const cardPayment = document.getElementById('card-payment');
        const paymentMethods = document.querySelectorAll('.payment-method');
        
        // Update active state
        paymentMethods.forEach(methodEl => {
            methodEl.classList.remove('active');
            if (methodEl.querySelector('input').value === method) {
                methodEl.classList.add('active');
            }
        });

        // Show/hide card form
        if (cardPayment) {
            cardPayment.style.display = method === 'card' ? 'block' : 'none';
        }
    }

    goToStep(step) {
        if (step < 1 || step > this.totalSteps) return;

        // Hide current step
        const currentStepEl = document.getElementById(`step-${this.currentStep}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'none';
        }

        // Update step indicators
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
            }
        });

        // Show new step
        const newStepEl = document.getElementById(`step-${step}`);
        if (newStepEl) {
            newStepEl.style.display = 'block';
        }

        this.currentStep = step;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    populateReviewData() {
        // Populate shipping review
        const shippingReview = document.getElementById('review-shipping');
        if (shippingReview && this.formData.shipping) {
            const { firstName, lastName, address, city, state, zipCode } = this.formData.shipping;
            shippingReview.innerHTML = `
                <p><strong>${firstName} ${lastName}</strong></p>
                <p>${address}</p>
                <p>${city}, ${state} ${zipCode}</p>
            `;
        }

        // Populate payment review
        const paymentReview = document.getElementById('review-payment');
        if (paymentReview && this.formData.payment) {
            const { method, cardNumber, cardName } = this.formData.payment;
            
            if (method === 'card' && cardNumber) {
                const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;
                paymentReview.innerHTML = `
                    <p><strong>Credit/Debit Card</strong></p>
                    <p>${maskedCard}</p>
                    <p>${cardName}</p>
                `;
            } else {
                const methodNames = {
                    paypal: 'PayPal',
                    'apple-pay': 'Apple Pay'
                };
                paymentReview.innerHTML = `<p><strong>${methodNames[method] || method}</strong></p>`;
            }
        }
    }

    placeOrder() {
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            
            // Generate order number
            const orderNumber = `SZ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
            document.getElementById('order-number').textContent = `#${orderNumber}`;
            
            // Set delivery date (5-7 business days)
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7);
            document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString();
            
            // Clear cart
            if (window.cart) {
                window.cart.clearCart();
            }
            
            // Go to confirmation step
            this.goToStep(4);
            
            // Send confirmation email (simulate)
            this.sendConfirmationEmail(orderNumber);
            
        }, 2000);
    }

    showLoading() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay active';
        overlay.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Processing your order...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    sendConfirmationEmail(orderNumber) {
        // In a real application, this would trigger a server-side email
        console.log(`Confirmation email sent for order ${orderNumber}`);
    }

    loadCartItems() {
        if (!window.cart) return;

        const cartData = window.cart.getCartData();
        this.populateOrderSummary(cartData.items);
    }

    populateOrderSummary(items) {
        const summaryItems = document.getElementById('summary-items');
        if (!summaryItems) return;

        if (items.length === 0) {
            summaryItems.innerHTML = '<p class="empty-message">No items in cart</p>';
            return;
        }

        summaryItems.innerHTML = items.map(item => `
            <div class="summary-item">
                <div class="item-image">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.name}">` : 
                        '<i class="fas fa-box"></i>'
                    }
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            </div>
        `).join('');
    }

    updateOrderSummary() {
        if (!window.cart) return;

        const cartData = window.cart.getCartData();
        const subtotal = cartData.total;
        const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
        const tax = subtotal * 0.08; // 8% tax
        
        let discount = 0;
        if (this.formData.promo) {
            const promo = this.promoCodes[this.formData.promo];
            if (promo.type === 'percentage') {
                discount = subtotal * (promo.value / 100);
            } else if (promo.type === 'fixed') {
                discount = Math.min(promo.value, subtotal);
            }
        }

        const total = subtotal + shipping + tax - discount;

        // Update UI
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping-cost').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        document.getElementById('tax-amount').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;

        // Show/hide discount row
        const discountRow = document.getElementById('discount-row');
        if (discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('discount-amount').textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promo-input');
        const promoMessage = document.getElementById('promo-message');
        const promoCode = promoInput.value.trim().toUpperCase();

        if (!promoCode) {
            this.showPromoMessage('Please enter a promo code', 'error');
            return;
        }

        if (this.promoCodes[promoCode]) {
            this.formData.promo = promoCode;
            this.updateOrderSummary();
            this.showPromoMessage(`✓ ${this.promoCodes[promoCode].description}`, 'success');
            promoInput.disabled = true;
            document.getElementById('apply-promo').textContent = 'Applied';
        } else {
            this.showPromoMessage('Invalid promo code', 'error');
        }
    }

    showPromoMessage(message, type) {
        const promoMessage = document.getElementById('promo-message');
        if (promoMessage) {
            promoMessage.textContent = message;
            promoMessage.className = `promo-message ${type}`;
        }
    }

    showEmptyCart() {
        const checkoutForms = document.querySelector('.checkout-forms');
        if (checkoutForms) {
            checkoutForms.innerHTML = `
                <div class="empty-cart-checkout">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Add some products to your cart before checkout</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
        }
    }

    downloadReceipt() {
        // In a real application, this would generate and download a PDF receipt
        alert('Receipt download functionality would be implemented here');
    }

    // Helper functions for input formatting
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    formatCVV(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new CheckoutManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutManager;
}