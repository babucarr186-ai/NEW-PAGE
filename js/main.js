// Main JavaScript - Interactive Features and App Initialization
class ShopZoneApp {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.initializeComponents();
        this.loadFeaturedProducts();
        this.setupSearch();
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupNewsletterForm();
        this.setupLogoAnimations();
        this.setupHeroTitleAnimation();
    }

    bindGlobalEvents() {
        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.handleResize();
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Click outside events
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    initializeComponents() {
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize image lazy loading
        this.initLazyLoading();
        
        // Initialize smooth scrolling for anchor links
        this.initSmoothScrolling();
        
        // Initialize quick view functionality
        this.initQuickView();
    }

    loadFeaturedProducts() {
        const featuredGrid = document.getElementById('featured-products-grid');
        if (featuredGrid && window.productManager) {
            const featuredProducts = window.productManager.getFeaturedProducts(6);
            window.productManager.renderProducts(featuredGrid, featuredProducts);
        }

        // Load products for products page
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid && window.productManager) {
            this.loadProductsPage();
        }
    }

    loadProductsPage() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid || !window.productManager) return;

        // Initial load
        window.productManager.applyFilters();
        window.productManager.renderProducts(productsGrid);
        this.updateResultsInfo();
        this.setupPagination();
        this.setupFilters();
        this.setupSorting();
        this.setupViewToggle();
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 500);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    this.performSearch(searchInput.value);
                }
            });
        }
    }

    performSearch(query = '') {
        if (!window.productManager) return;

        window.productManager.updateFilters({ search: query });
        
        // If on products page, update the grid
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            window.productManager.renderProducts(productsGrid);
            this.updateResultsInfo();
            this.updatePagination();
        } else if (query.trim()) {
            // Redirect to products page with search
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }

    setupFilters() {
        // Category filters
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Brand filters
        const brandFilters = document.querySelectorAll('.brand-filter');
        brandFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Rating filters
        const ratingFilters = document.querySelectorAll('.rating-filter');
        ratingFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Price range filters
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');

        if (priceMin && priceMax) {
            [priceMin, priceMax].forEach(slider => {
                slider.addEventListener('input', () => {
                    this.updatePriceInputs();
                    this.updateFilters();
                });
            });
        }

        if (minInput && maxInput) {
            [minInput, maxInput].forEach(input => {
                input.addEventListener('change', () => {
                    this.updatePriceSliders();
                    this.updateFilters();
                });
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    updateFilters() {
        if (!window.productManager) return;

        const filters = {
            categories: Array.from(document.querySelectorAll('.category-filter:checked')).map(f => f.value),
            brands: Array.from(document.querySelectorAll('.brand-filter:checked')).map(f => f.value),
            ratings: Array.from(document.querySelectorAll('.rating-filter:checked')).map(f => f.value),
            priceMin: parseInt(document.getElementById('price-min')?.value || 0),
            priceMax: parseInt(document.getElementById('price-max')?.value || 1000)
        };

        window.productManager.updateFilters(filters);
        
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            window.productManager.renderProducts(productsGrid);
            this.updateResultsInfo();
            this.updatePagination();
        }
    }

    updatePriceInputs() {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');

        if (priceMin && minInput) minInput.value = priceMin.value;
        if (priceMax && maxInput) maxInput.value = priceMax.value;
    }

    updatePriceSliders() {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');

        if (priceMin && minInput) priceMin.value = minInput.value;
        if (priceMax && maxInput) priceMax.value = maxInput.value;
    }

    clearAllFilters() {
        // Clear checkboxes
        document.querySelectorAll('.category-filter, .brand-filter, .rating-filter')
            .forEach(checkbox => checkbox.checked = false);

        // Reset price range
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');

        if (priceMin) priceMin.value = 0;
        if (priceMax) priceMax.value = 1000;
        if (minInput) minInput.value = 0;
        if (maxInput) maxInput.value = 1000;

        // Clear search
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        // Update filters
        if (window.productManager) {
            window.productManager.clearFilters();
            const productsGrid = document.getElementById('products-grid');
            if (productsGrid) {
                window.productManager.renderProducts(productsGrid);
                this.updateResultsInfo();
                this.updatePagination();
            }
        }
    }

    setupSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                if (window.productManager) {
                    window.productManager.setSorting(e.target.value);
                    const productsGrid = document.getElementById('products-grid');
                    if (productsGrid) {
                        window.productManager.renderProducts(productsGrid);
                        this.updatePagination();
                    }
                }
            });
        }
    }

    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
                
                // Update active state
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchView(view) {
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.className = `products-grid ${view === 'list' ? 'list-view' : ''}`;
            
            if (window.productManager) {
                window.productManager.setView(view);
            }
        }
    }

    setupPagination() {
        if (!window.productManager) return;

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const currentPage = window.productManager.currentPage;
                if (window.productManager.setPage(currentPage - 1)) {
                    this.loadCurrentPage();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentPage = window.productManager.currentPage;
                if (window.productManager.setPage(currentPage + 1)) {
                    this.loadCurrentPage();
                }
            });
        }

        this.updatePagination();
    }

    updatePagination() {
        if (!window.productManager) return;

        const stats = window.productManager.getFilterStats();
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');

        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = stats.currentPage === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = stats.currentPage === stats.totalPages;
        }

        // Update page numbers
        if (pageNumbers) {
            pageNumbers.innerHTML = this.generatePageNumbers(stats.currentPage, stats.totalPages);
        }
    }

    generatePageNumbers(currentPage, totalPages) {
        let pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, '...', totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="page-ellipsis">...</span>';
            } else {
                const isActive = page === currentPage;
                return `<button class="page-number ${isActive ? 'active' : ''}" 
                                onclick="app.goToPage(${page})">${page}</button>`;
            }
        }).join('');
    }

    goToPage(page) {
        if (window.productManager && window.productManager.setPage(page)) {
            this.loadCurrentPage();
        }
    }

    loadCurrentPage() {
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid && window.productManager) {
            window.productManager.renderProducts(productsGrid);
            this.updateResultsInfo();
            this.updatePagination();
            
            // Scroll to top of products
            productsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount && window.productManager) {
            const stats = window.productManager.getFilterStats();
            const start = (stats.currentPage - 1) * stats.itemsPerPage + 1;
            const end = Math.min(stats.currentPage * stats.itemsPerPage, stats.filtered);
            
            resultsCount.textContent = 
                `Showing ${start}-${end} of ${stats.filtered} products`;
        }
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
                const icon = mobileToggle.querySelector('i');
                
                if (nav.classList.contains('mobile-open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
        }

        // Mobile filters toggle
        const filterToggle = document.getElementById('filter-toggle');
        const filtersSidebar = document.querySelector('.filters-sidebar');
        
        if (filterToggle && filtersSidebar) {
            filterToggle.addEventListener('click', () => {
                filtersSidebar.classList.toggle('open');
                document.body.style.overflow = 
                    filtersSidebar.classList.contains('open') ? 'hidden' : '';
            });
        }
    }

    setupScrollEffects() {
        // Header scroll effect
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }
            lastScrollY = window.scrollY;
        });
    }

    setupNewsletterForm() {
        const newsletterSubmit = document.getElementById('newsletter-submit');
        const newsletterEmail = document.getElementById('newsletter-email');
        
        if (newsletterSubmit && newsletterEmail) {
            newsletterSubmit.addEventListener('click', () => {
                const email = newsletterEmail.value.trim();
                
                if (this.validateEmail(email)) {
                    this.submitNewsletter(email);
                } else {
                    this.showNotification('Please enter a valid email address', 'error');
                }
            });
            
            newsletterEmail.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    newsletterSubmit.click();
                }
            });
        }
    }

    submitNewsletter(email) {
        // Simulate API call
        this.showNotification('Subscribing...', 'info');
        
        setTimeout(() => {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            document.getElementById('newsletter-email').value = '';
        }, 1500);
    }

    setupLogoAnimations() {
        const logoElement = document.querySelector('.animated-text');
        if (!logoElement) return;

        // Split text into individual letters
        const text = logoElement.textContent;
        logoElement.innerHTML = '';

        // Create spans for each letter
        text.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter; // Use non-breaking space for spaces
            span.style.display = 'inline-block';
            span.style.animationDelay = `${index * 0.1}s`;
            logoElement.appendChild(span);
        });

        // Add scroll-based shaking
        let lastScrollY = window.scrollY;
        let shakeTimeout;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = Math.abs(currentScrollY - lastScrollY);

            // Trigger shake if scrolling significantly
            if (scrollDifference > 10) {
                logoElement.style.animation = 'shakeOnScroll 0.5s ease-in-out';

                // Reset animation after it completes
                clearTimeout(shakeTimeout);
                shakeTimeout = setTimeout(() => {
                    logoElement.style.animation = 'gradientShift 3s ease-in-out infinite';
                }, 500);
            }

            lastScrollY = currentScrollY;
        });

        // Add hover effect
        logoElement.addEventListener('mouseenter', () => {
            logoElement.style.animation = 'shakeOnScroll 0.3s ease-in-out infinite, gradientShift 2s ease-in-out infinite';
        });

        logoElement.addEventListener('mouseleave', () => {
            logoElement.style.animation = 'gradientShift 3s ease-in-out infinite';
        });
    }

    setupHeroTitleAnimation() {
        const heroTitle = document.getElementById('hero-title');
        if (!heroTitle) return;

        // Split text into individual letters
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';

        // Create spans for each letter with matrix effect
        text.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter; // Use non-breaking space for spaces
            span.style.display = 'inline-block';
            span.style.position = 'relative';

            // Add matrix-style animation
            span.style.animation = `matrixFall 2.5s ease-out forwards`;
            span.style.animationDelay = `${index * 0.15 + 0.5}s`; // Start after logo animation

            // Add glow effect
            span.style.textShadow = '0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.4)';
            span.style.color = '#dc2626';

            heroTitle.appendChild(span);
        });

        // Add continuous matrix rain effect
        this.createMatrixRain();
    }

    createMatrixRain() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Create matrix rain container
        const rainContainer = document.createElement('div');
        rainContainer.className = 'matrix-rain';
        rainContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        `;

        heroSection.style.position = 'relative';
        heroSection.appendChild(rainContainer);

        // Create falling characters
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createFallingChar(rainContainer, characters);
            }, i * 100);
        }

        // Continuously create new falling characters
        setInterval(() => {
            this.createFallingChar(rainContainer, characters);
        }, 200);
    }

    createFallingChar(container, characters) {
        const char = document.createElement('div');
        char.textContent = characters[Math.floor(Math.random() * characters.length)];
        char.style.cssText = `
            position: absolute;
            color: #dc2626;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            opacity: 0.7;
            text-shadow: 0 0 5px rgba(220, 38, 38, 0.5);
            animation: fallDown ${2 + Math.random() * 3}s linear forwards;
            left: ${Math.random() * 100}%;
            top: -20px;
        `;

        container.appendChild(char);

        // Remove after animation
        setTimeout(() => {
            char.remove();
        }, 5000);
    }

    initQuickView() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-btn') || 
                e.target.closest('.quick-view-btn')) {
                
                const btn = e.target.classList.contains('quick-view-btn') ? 
                           e.target : e.target.closest('.quick-view-btn');
                
                const productId = btn.dataset.productId;
                this.openQuickView(productId);
            }
        });

        // Close quick view
        const closeBtn = document.getElementById('close-quick-view');
        const overlay = document.getElementById('quick-view-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeQuickView());
        }
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeQuickView();
                }
            });
        }
    }

    openQuickView(productId) {
        if (!window.productManager) return;
        
        const product = window.productManager.getProductById(productId);
        if (!product) return;

        const overlay = document.getElementById('quick-view-overlay');
        const content = document.getElementById('quick-view-content');
        
        if (overlay && content) {
            content.innerHTML = this.generateQuickViewContent(product);
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeQuickView() {
        const overlay = document.getElementById('quick-view-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    generateQuickViewContent(product) {
        return `
            <div class="quick-view-images">
                <div class="main-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}">` : 
                        `<i class="fas fa-${window.productManager.getCategoryIcon(product.category)}"></i>`
                    }
                </div>
            </div>
            <div class="quick-view-details">
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">
                        ${window.productManager.renderStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount} reviews)</span>
                </div>
                <div class="quick-view-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <p class="quick-view-description">${product.description}</p>
                <div class="product-options">
                    <div class="option-group">
                        <label>Size:</label>
                        <div class="option-buttons">
                            <button class="option-btn active">M</button>
                            <button class="option-btn">L</button>
                            <button class="option-btn">XL</button>
                        </div>
                    </div>
                    <div class="option-group">
                        <label>Color:</label>
                        <div class="option-buttons">
                            <button class="option-btn active">Black</button>
                            <button class="option-btn">White</button>
                            <button class="option-btn">Blue</button>
                        </div>
                    </div>
                </div>
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                        <button onclick="this.nextElementSibling.stepDown()">-</button>
                        <input type="number" value="1" min="1" max="10">
                        <button onclick="this.previousElementSibling.stepUp()">+</button>
                    </div>
                </div>
                <div class="quick-view-actions">
                    <button class="btn-primary add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="btn-secondary">Add to Wishlist</button>
                </div>
            </div>
        `;
    }

    initTooltips() {
        // Simple tooltip implementation
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-dark);
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                         