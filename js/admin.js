// Admin Interface for Product Management
class AdminManager {
    constructor() {
        this.currentEditingProduct = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
    }

    bindEvents() {
        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openAddProductModal();
        });

        // Refresh products button
        document.getElementById('refreshProductsBtn').addEventListener('click', () => {
            this.loadProducts();
        });

        // Modal events
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Image upload functionality
        document.getElementById('uploadImageBtn').addEventListener('click', () => {
            document.getElementById('productImageFile').click();
        });

        document.getElementById('productImageFile').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        document.getElementById('removeImageBtn').addEventListener('click', () => {
            this.removeImage();
        });

        // Close modal when clicking outside
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.closeModal();
            }
        });
    }

    loadProducts() {
        const products = window.productManager.products;
        const productsGrid = document.getElementById('productsGrid');
        const productCount = document.getElementById('productCount');

        productCount.textContent = products.length;

        productsGrid.innerHTML = products.map(product => this.renderAdminProductCard(product)).join('');
    }

    renderAdminProductCard(product) {
        return `
            <div class="admin-product-card" data-product-id="${product.id}">
                <div class="admin-product-image">
                    ${product.image ?
                        `<img src="${product.image}" alt="${product.name}">` :
                        `<i class="fas fa-${window.productManager.getCategoryIcon(product.category)}"></i>`
                    }
                </div>
                <div class="admin-product-info">
                    <h3>${product.name}</h3>
                    <p class="admin-product-category">${product.category} • ${product.brand}</p>
                    <p class="admin-product-price">
                        ${new Intl.NumberFormat('en-GM', {
                            style: 'currency',
                            currency: 'GMD'
                        }).format(product.price)}
                        ${product.oldPrice ? ` <span class="old-price">${new Intl.NumberFormat('en-GM', {
                            style: 'currency',
                            currency: 'GMD'
                        }).format(product.oldPrice)}</span>` : ''}
                    </p>
                    <div class="admin-product-status">
                        <span class="status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        ${product.featured ? '<span class="status-badge featured">Featured</span>' : ''}
                    </div>
                </div>
                <div class="admin-product-actions">
                    <button class="btn-edit" onclick="adminManager.editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="adminManager.deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    openAddProductModal() {
        this.currentEditingProduct = null;
        document.getElementById('modalTitle').textContent = 'Add New Product';
        document.getElementById('productForm').reset();
        document.getElementById('productModal').style.display = 'block';
    }

    editProduct(productId) {
        const product = window.productManager.getProductById(productId);
        if (!product) return;

        this.currentEditingProduct = product;

        // Fill form with product data
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOldPrice').value = product.oldPrice || '';
        document.getElementById('productRating').value = product.rating;
        document.getElementById('productReviewCount').value = product.reviewCount;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFeatures').value = product.features ? product.features.join(', ') : '';
        document.getElementById('productImage').value = product.image || '';
        if (product.image) {
            this.showImagePreview(product.image);
        }

        document.getElementById('productInStock').checked = product.inStock;
        document.getElementById('productFeatured').checked = product.featured;

        document.getElementById('productModal').style.display = 'block';
    }

    saveProduct() {
        const formData = {
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value,
            brand: document.getElementById('productBrand').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            oldPrice: document.getElementById('productOldPrice').value ?
                parseFloat(document.getElementById('productOldPrice').value) : null,
            rating: parseFloat(document.getElementById('productRating').value) || 4.0,
            reviewCount: parseInt(document.getElementById('productReviewCount').value) || 0,
            description: document.getElementById('productDescription').value.trim(),
            features: document.getElementById('productFeatures').value ?
                document.getElementById('productFeatures').value.split(',').map(f => f.trim()).filter(f => f) : [],
            image: document.getElementById('productImage').value.trim() || null,
            inStock: document.getElementById('productInStock').checked,
            featured: document.getElementById('productFeatured').checked
        };

        try {
            if (this.currentEditingProduct) {
                // Update existing product
                window.productManager.updateProduct(this.currentEditingProduct.id, formData);
                this.showMessage('Product updated successfully!', 'success');
            } else {
                // Add new product
                window.productManager.addProduct(formData);
                this.showMessage('Product added successfully!', 'success');
            }

            this.closeModal();
            this.loadProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            this.showMessage('Error saving product. Please try again.', 'error');
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                window.productManager.deleteProduct(productId);
                this.showMessage('Product deleted successfully!', 'success');
                this.loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                this.showMessage('Error deleting product. Please try again.', 'error');
            }
        }
    }

    closeModal() {
        document.getElementById('productModal').style.display = 'none';
        document.getElementById('productForm').reset();
        this.currentEditingProduct = null;
        this.removeImage(); // Clear image preview
    }

    handleImageUpload(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('Image file size must be less than 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            document.getElementById('productImage').value = imageUrl;
            this.showImagePreview(imageUrl);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(imageUrl) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        previewImg.src = imageUrl;
        preview.style.display = 'block';
    }

    removeImage() {
        document.getElementById('productImage').value = '';
        document.getElementById('productImageFile').value = '';
        document.getElementById('imagePreview').style.display = 'none';
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `admin-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;

        // Add to page
        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});