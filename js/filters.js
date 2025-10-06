// Product Filters and Search Functionality
class ProductFilters {
    constructor() {
        this.activeFilters = {
            categories: [],
            brands: [],
            ratings: [],
            priceRange: { min: 0, max: 1000 },
            search: ''
        };
        
        this.init();
    }

    init() {
        this.bindFilterEvents();
        this.loadURLParams();
    }

    bindFilterEvents() {
        // Category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.handleCategoryFilter(e.target.value, e.target.checked);
            });
        });

        // Brand filters
        document.querySelectorAll('.brand-filter').forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.handleBrandFilter(e.target.value, e.target.checked);
            });
        });

        // Rating filters
        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.handleRatingFilter(e.target.value, e.target.checked);
            });
        });

        // Price range sliders
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        
        if (priceMin) {
            priceMin.addEventListener('input', (e) => {
                this.handlePriceChange('min', e.target.value);
            });
        }

        if (priceMax) {
            priceMax.addEventListener('input', (e) => {
                this.handlePriceChange('max', e.target.value);
            });
        }

        // Price input fields
        const minPriceInput = document.getElementById('min-price-input');
        const maxPriceInput = document.getElementById('max-price-input');

        if (minPriceInput) {
            minPriceInput.addEventListener('change', (e) => {
                this.handlePriceInputChange('min', e.target.value);
            });
        }

        if (maxPriceInput) {
            maxPriceInput.addEventListener('change', (e) => {
                this.handlePriceInputChange('max', e.target.value);
            });
        }

        // Clear filters
        const clearButton = document.getElementById('clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    handleCategoryFilter(category, isChecked) {
        if (isChecked) {
            if (!this.activeFilters.categories.includes(category)) {
                this.activeFilters.categories.push(category);
            }
        } else {
            this.activeFilters.categories = this.activeFilters.categories.filter(c => c !== category);
        }
        
        this.applyFilters();
    }

    handleBrandFilter(brand, isChecked) {
        if (isChecked) {
            if (!this.activeFilters.brands.includes(brand)) {
                this.activeFilters.brands.push(brand);
            }
        } else {
            this.activeFilters.brands = this.activeFilters.brands.filter(b => b !== brand);
        }
        
        this.applyFilters();
    }

    handleRatingFilter(rating, isChecked) {
        if (isChecked) {
            if (!this.activeFilters.ratings.includes(rating)) {
                this.activeFilters.ratings.push(rating);
            }
        } else {
            this.activeFilters.ratings = this.activeFilters.ratings.filter(r => r !== rating);
        }
        
        this.applyFilters();
    }

    handlePriceChange(type, value) {
        this.activeFilters.priceRange[type] = parseInt(value);
        
        // Update input fields
        const input = document.getElementById(`${type}-price-input`);
        if (input) {
            input.value = value;
        }
        
        // Ensure min doesn't exceed max
        if (type === 'min' && this.activeFilters.priceRange.min > this.activeFilters.priceRange.max) {
            this.activeFilters.priceRange.max = this.activeFilters.priceRange.min;
            const maxSlider = document.getElementById('price-max');
            const maxInput = document.getElementById('max-price-input');
            if (maxSlider) maxSlider.value = this.activeFilters.priceRange.min;
            if (maxInput) maxInput.value = this.activeFilters.priceRange.min;
        }
        
        // Ensure max doesn't go below min
        if (type === 'max' && this.activeFilters.priceRange.max < this.activeFilters.priceRange.min) {
            this.activeFilters.priceRange.min = this.activeFilters.priceRange.max;
            const minSlider = document.getElementById('price-min');
            const minInput = document.getElementById('min-price-input');
            if (minSlider) minSlider.value = this.activeFilters.priceRange.max;
            if (minInput) minInput.value = this.activeFilters.priceRange.max;
        }
        
        this.debounceApplyFilters();
    }

    handlePriceInputChange(type, value) {
        const numValue = parseInt(value) || 0;
        this.activeFilters.priceRange[type] = numValue;
        
        // Update sliders
        const slider = document.getElementById(`price-${type}`);
        if (slider) {
            slider.value = numValue;
        }
        
        this.applyFilters();
    }

    debounceApplyFilters() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        
        this.debounceTimeout = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    applyFilters() {
        if (!window.productManager) return;

        // Update product manager filters
        window.productManager.updateFilters({
            categories: this.activeFilters.categories,
            brands: this.activeFilters.brands,
            ratings: this.activeFilters.ratings,
            priceMin: this.activeFilters.priceRange.min,
            priceMax: this.activeFilters.priceRange.max,
            search: this.activeFilters.search
        });

        // Re-render products
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            window.productManager.renderProducts(productsGrid);
            
            // Update results info and pagination
            if (window.app) {
                window.app.updateResultsInfo();
                window.app.updatePagination();
            }
        }

        // Update URL params
        this.updateURLParams();
        
        // Show/hide no results message
        this.updateNoResultsMessage();
    }

    clearAllFilters() {
        // Reset active filters
        this.activeFilters = {
            categories: [],
            brands: [],
            ratings: [],
            priceRange: { min: 0, max: 1000 },
            search: ''
        };

        // Reset UI elements
        document.querySelectorAll('.category-filter, .brand-filter, .rating-filter')
            .forEach(checkbox => {
                checkbox.checked = false;
            });

        // Reset price range
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');

        if (priceMin) priceMin.value = 0;
        if (priceMax) priceMax.value = 1000;
        if (minInput) minInput.value = 0;
        if (maxInput) maxInput.value = 1000;

        // Reset search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Apply cleared filters
        this.applyFilters();
    }

    updateNoResultsMessage() {
        const productsGrid = document.getElementById('products-grid');
        const noResults = document.getElementById('no-results');
        
        if (!window.productManager) return;
        
        const stats = window.productManager.getFilterStats();
        
        if (stats.filtered === 0) {
            if (productsGrid) productsGrid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (productsGrid) productsGrid.style.display = 'grid';
            if (noResults) noResults.style.display = 'none';
        }
    }

    loadURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        // Load search parameter
        const search = params.get('search');
        if (search) {
            this.activeFilters.search = search;
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = search;
            }
        }

        // Load category filters
        const categories = params.get('categories');
        if (categories) {
            this.activeFilters.categories = categories.split(',');
            this.activeFilters.categories.forEach(category => {
                const checkbox = document.querySelector(`.category-filter[value="${category}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        // Load brand filters
        const brands = params.get('brands');
        if (brands) {
            this.activeFilters.brands = brands.split(',');
            this.activeFilters.brands.forEach(brand => {
                const checkbox = document.querySelector(`.brand-filter[value="${brand}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        // Load price range
        const minPrice = params.get('minPrice');
        const maxPrice = params.get('maxPrice');
        
        if (minPrice) {
            this.activeFilters.priceRange.min = parseInt(minPrice);
            const minSlider = document.getElementById('price-min');
            const minInput = document.getElementById('min-price-input');
            if (minSlider) minSlider.value = minPrice;
            if (minInput) minInput.value = minPrice;
        }
        
        if (maxPrice) {
            this.activeFilters.priceRange.max = parseInt(maxPrice);
            const maxSlider = document.getElementById('price-max');
            const maxInput = document.getElementById('max-price-input');
            if (maxSlider) maxSlider.value = maxPrice;
            if (maxInput) maxInput.value = maxPrice;
        }

        // Apply loaded filters
        if (search || categories || brands || minPrice || maxPrice) {
            this.applyFilters();
        }
    }

    updateURLParams() {
        const params = new URLSearchParams();
        
        // Add search parameter
        if (this.activeFilters.search) {
            params.set('search', this.activeFilters.search);
        }
        
        // Add category filters
        if (this.activeFilters.categories.length > 0) {
            params.set('categories', this.activeFilters.categories.join(','));
        }
        
        // Add brand filters
        if (this.activeFilters.brands.length > 0) {
            params.set('brands', this.activeFilters.brands.join(','));
        }
        
        // Add price range
        if (this.activeFilters.priceRange.min > 0) {
            params.set('minPrice', this.activeFilters.priceRange.min.toString());
        }
        
        if (this.activeFilters.priceRange.max < 1000) {
            params.set('maxPrice', this.activeFilters.priceRange.max.toString());
        }
        
        // Update URL without reloading
        const newURL = params.toString() ? 
            `${window.location.pathname}?${params.toString()}` : 
            window.location.pathname;
            
        window.history.replaceState({}, '', newURL);
    }

    getActiveFiltersCount() {
        let count = 0;
        count += this.activeFilters.categories.length;
        count += this.activeFilters.brands.length;
        count += this.activeFilters.ratings.length;
        
        if (this.activeFilters.priceRange.min > 0 || this.activeFilters.priceRange.max < 1000) {
            count += 1;
        }
        
        if (this.activeFilters.search) {
            count += 1;
        }
        
        return count;
    }

    showActiveFiltersIndicator() {
        const count = this.getActiveFiltersCount();
        const indicator = document.querySelector('.active-filters-indicator');
        
        if (count > 0) {
            if (!indicator) {
                const newIndicator = document.createElement('div');
                newIndicator.className = 'active-filters-indicator';
                newIndicator.textContent = `${count} filter${count > 1 ? 's' : ''} active`;
                
                const clearButton = document.getElementById('clear-filters');
                if (clearButton && clearButton.parentNode) {
                    clearButton.parentNode.insertBefore(newIndicator, clearButton);
                }
            } else {
                indicator.textContent = `${count} filter${count > 1 ? 's' : ''} active`;
            }
        } else if (indicator) {
            indicator.remove();
        }
    }

    // Advanced filter methods
    addQuickFilter(type, value) {
        switch (type) {
            case 'category':
                if (!this.activeFilters.categories.includes(value)) {
                    this.activeFilters.categories.push(value);
                    const checkbox = document.querySelector(`.category-filter[value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                }
                break;
                
            case 'brand':
                if (!this.activeFilters.brands.includes(value)) {
                    this.activeFilters.brands.push(value);
                    const checkbox = document.querySelector(`.brand-filter[value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                }
                break;
                
            case 'price':
                if (value.min !== undefined) this.activeFilters.priceRange.min = value.min;
                if (value.max !== undefined) this.activeFilters.priceRange.max = value.max;
                this.updatePriceUI();
                break;
        }
        
        this.applyFilters();
    }

    removeQuickFilter(type, value) {
        switch (type) {
            case 'category':
                this.activeFilters.categories = this.activeFilters.categories.filter(c => c !== value);
                const categoryCheckbox = document.querySelector(`.category-filter[value="${value}"]`);
                if (categoryCheckbox) categoryCheckbox.checked = false;
                break;
                
            case 'brand':
                this.activeFilters.brands = this.activeFilters.brands.filter(b => b !== value);
                const brandCheckbox = document.querySelector(`.brand-filter[value="${value}"]`);
                if (brandCheckbox) brandCheckbox.checked = false;
                break;
        }
        
        this.applyFilters();
    }

    updatePriceUI() {
        const minSlider = document.getElementById('price-min');
        const maxSlider = document.getElementById('price-max');
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');
        
        if (minSlider) minSlider.value = this.activeFilters.priceRange.min;
        if (maxSlider) maxSlider.value = this.activeFilters.priceRange.max;
        if (minInput) minInput.value = this.activeFilters.priceRange.min;
        if (maxInput) maxInput.value = this.activeFilters.priceRange.max;
    }

    setSearch(searchTerm) {
        this.activeFilters.search = searchTerm;
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
        this.applyFilters();
    }

    getFilterSummary() {
        return {
            active: this.getActiveFiltersCount(),
            categories: this.activeFilters.categories,
            brands: this.activeFilters.brands,
            ratings: this.activeFilters.ratings,
            priceRange: this.activeFilters.priceRange,
            search: this.activeFilters.search
        };
    }
}

// Initialize filters when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        window.productFilters = new ProductFilters();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductFilters;
}